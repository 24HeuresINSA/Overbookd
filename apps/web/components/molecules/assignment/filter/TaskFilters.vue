<template>
  <div class="filters">
    <v-text-field
      :value="search"
      class="filters__search"
      label="Recherche"
      hide-details
      @input="changeSearch"
    ></v-text-field>
    <SearchTeams
      :teams="requiredTeams"
      label="Chercher par équipe requise"
      class="filters__field filter__multi-select"
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
      <v-switch
        v-show="isOrgaTaskMode"
        v-model="hasAssignedFriends"
        label="Amis assignés"
        class="filters__switch"
        hide-details
        @change="changeHasAssignedFriends"
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
import { TaskPriorities, TaskPriority } from "~/utils/assignment/task-priority";
import { Team } from "~/utils/models/team.model";

type TaskFiltersData = {
  completed: boolean;
  hasAssignedFriends: boolean;
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
    "change:has-assigned-friends",
  ],
  data: (): TaskFiltersData => ({
    completed: false,
    hasAssignedFriends: false,
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
    changeHasAssignedFriends(state: boolean) {
      this.hasAssignedFriends = state;
      this.$emit("change:has-assigned-friends", state);
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  height: fit-content;
  padding: 0px 15px;
  margin-top: auto;

  &__field {
    width: 100%;
    padding: 5px, 0px;
    height: 65px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  &__multi-select {
    max-height: 200px;
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
