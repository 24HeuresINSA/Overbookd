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
    <p>
      {{ counterLabel }}
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeams from "~/components/atoms/SearchTeams.vue";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "AssignmentFilters",
  components: { SearchTeams },
  props: {
    type: {
      type: String,
      required: false,
      default: "volunteer",
    },
    listLength: {
      type: Number,
      default: 0,
    },
  },
  data: () => ({
    search: "",
    teams: [],
  }),
  computed: {
    counterLabel(): string {
      switch (this.type) {
        case "timespan":
          return "Nombre de créneaux dans la liste : ";
        case "ft":
          return "Nombre de FT dans la liste : ";
        default:
          return "Nombre de bénévoles dans la liste : ";
      }
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeTeams(teams: Team[]) {
      this.$emit("change:teams", teams);
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding: 0 1rem;

  &__field {
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
}
</style>
