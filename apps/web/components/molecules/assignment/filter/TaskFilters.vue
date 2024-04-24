<template>
  <div class="filters">
    <v-text-field
      :value="search"
      class="filters__field"
      label="Recherche"
      hide-details
      @input="changeSearch"
    ></v-text-field>
    <SearchTeams
      :value="requiredTeams"
      label="Chercher par équipe requise"
      class="filters__field"
      :boxed="false"
      hide-details
      @change="changeTeamsRequired"
    ></SearchTeams>
    <SearchTeam
      :value="inChargeTeam"
      label="Chercher par équipe responsable"
      class="filters__field"
      :boxed="false"
      hide-details
      @change="changeTeamsCreation"
    ></SearchTeam>
    <div class="team-filter-completed-switch">
      <v-combobox
        :value="category"
        :items="categoryItems"
        label="Chercher une catégorie"
        class="filters__field"
        clearable
        return-object
        hide-details
        @change="changeCategory"
      ></v-combobox>
      <v-switch
        v-show="!isOrgaTaskMode"
        v-model="completed"
        label="Toutes les FTs"
        class="filters__switch"
        hide-details
        @change="changeCompleted"
      ></v-switch>
    </div>
    <p class="stats">
      {{ counterLabel }}
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  DisplayableCategory,
  displayableCategories,
} from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  TaskPriority,
} from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team.model";

type TaskFiltersData = {
  completed: boolean;
  search: string;
  requiredTeams: Team[];
  inChargeTeam: Team | null;
  category: DisplayableCategory | TaskPriority | null;
};

export default defineComponent({
  name: "TaskFilters",
  components: { SearchTeams, SearchTeam },
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
  emits: [
    "change:search",
    "change:required-teams",
    "change:in-charge-team",
    "change:category",
    "change:completed",
  ],
  data: (): TaskFiltersData => ({
    completed: false,
    search: "",
    requiredTeams: [],
    inChargeTeam: null,
    category: null,
  }),
  computed: {
    counterLabel(): string {
      return this.type === "ft"
        ? "Nombre de FT dans la liste : "
        : "Nombre de créneaux dans la liste : ";
    },
    categoryItems(): string[] {
      return [...Object.values(TaskPriorities), ...displayableCategories];
    },
    isOrgaTaskMode(): boolean {
      return isOrgaTaskMode(this.$route.path);
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeTeamsRequired(requiredTeams: Team[]) {
      this.requiredTeams = requiredTeams;
      this.$emit("change:required-teams", requiredTeams);
    },
    changeTeamsCreation(inChargeTeam: Team | null) {
      this.inChargeTeam = inChargeTeam;
      this.$emit("change:in-charge-team", inChargeTeam);
    },
    changeCategory(category: string) {
      this.$emit("change:category", category);
    },
    changeCompleted(state: boolean) {
      this.completed = state;
      this.$emit("change:completed", state);
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  gap: 15px;

  &__field {
    width: 100%;
    padding: 0 25px;
  }
}

.stats {
  margin-bottom: 5px;
}

.team-filter-completed-switch {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  .filters {
    &__switch {
      margin-top: 0;
      margin-right: 5px;
    }
  }
}
</style>
