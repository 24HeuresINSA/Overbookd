<template>
  <div class="filters">
    <v-text-field
      :value="search"
      class="filters__field"
      label="Recherche"
      @input="changeSearch"
    ></v-text-field>
    <SearchTeams
      :value="teams"
      class="filters__field"
      :boxed="false"
      @change="changeTeams"
    ></SearchTeams>
    <v-combobox
      :value="category"
      :items="categoryItems"
      label="Chercher une catégorie"
      class="filters__field"
      clearable
      return-object
      @change="changeCategory"
    ></v-combobox>
    <p class="stats">
      {{ counterLabel }}
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import {
  TaskCategories,
  TaskCategory,
  TaskPriorities,
  TaskPriority,
} from "~/utils/models/ftTimespan";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "FtTimespanFilters",
  components: { SearchTeams },
  props: {
    type: {
      type: String,
      required: false,
      default: "ft",
    },
    listLength: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    search: "",
    teams: [] as Team[],
    category: null as TaskCategory | TaskPriority | null,
  }),
  computed: {
    counterLabel(): string {
      return this.type === "ft"
        ? "Nombre de FT dans la liste : "
        : "Nombre de créneaux dans la liste : ";
    },
    categoryItems(): string[] {
      return [
        ...Object.values(TaskPriorities),
        ...Object.values(TaskCategories),
      ];
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeTeams(teams: Team[]) {
      this.$emit("change:teams", teams);
    },
    changeCategory(category: string) {
      this.$emit("change:category", category);
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  padding: 0 25px;

  &__field {
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
}

.stats {
  margin-bottom: 5px;
}
</style>
