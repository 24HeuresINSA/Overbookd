<template>
  <div class="filters">
    <v-text-field
      v-model="filters.search"
      class="filters__field"
      label="Recherche"
      density="compact"
      hide-details
      clearable
      @click:clear="filters.search = ''"
      @update:model-value="updateSearchParam"
    />

    <SearchTeams
      v-model="requiredTeams"
      label="Chercher par équipe(s) requise(s)"
      class="filters__field"
      density="compact"
      closable-chips
      hide-details
      clearable
      @update:model-value="updateRequiredTeamsParam"
    />

    <SearchTeam
      v-model="filters.inChargeTeam"
      label="Chercher par équipe responsable"
      class="filters__field"
      density="compact"
      hide-details
      clearable
      @update:model-value="updateInChargeTeamParam"
    />

    <v-combobox
      v-model="filters.category"
      :items="categoryItems"
      label="Chercher une catégorie"
      class="filters__field"
      density="compact"
      clearable
      return-object
      hide-details
      @update:model-value="updateCategoryParam"
    />

    <div class="filters-row">
      <v-switch
        v-if="isOrgaTask"
        v-model="filters.hasAssignedFriends"
        label="Ami·e·s affecté·e·s"
        density="compact"
        color="primary"
        class="filters-row__switch"
        hide-details
        @update:model-value="updateHasAssignedFriendsParam"
      />
      <v-switch
        v-else
        v-model="filters.completed"
        label="FTs completées"
        density="compact"
        color="primary"
        class="filters-row__switch"
        hide-details
        @update:model-value="updateCompletedParam"
      />
      <v-switch
        v-model="filters.past"
        label="FTs passées"
        density="compact"
        color="primary"
        class="filters-row__switch"
        hide-details
        @update:model-value="updatePastParam"
      />
    </div>

    <p class="stats">
      {{ counterLabel }}
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { FestivalEventIdentifier } from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  displayableCategories,
  type DisplayableCategory,
} from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  type TaskPriority,
} from "~/utils/assignment/task-priority";
import { useDebounceFn } from "@vueuse/core";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import {
  COMPLETED_TASKS_QUERY_PARAM,
  HAS_ASSIGNED_FRIENDS_QUERY_PARAM,
  IN_CHARGE_TEAM_QUERY_PARAM,
  PAST_ASSIGNMENTS_QUERY_PARAM,
  REQUIRED_TEAMS_QUERY_PARAM,
  TASK_CATEGORY_QUERY_PARAM,
  TASK_SEARCH_QUERY_PARAM,
} from "~/utils/assignment/filters/assignment-filters.constant";
import type { TaskAssignmentFilters } from "~/utils/assignment/filters/task-assignment.filter";

const route = useRoute();

const props = defineProps({
  type: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FT",
  },
  listLength: {
    type: Number,
    default: 0,
  },
});

const filters = defineModel<TaskAssignmentFilters>({ required: true });
const requiredTeams = computed<Team[]>({
  get: () => filters.value.requiredTeams ?? [],
  set: (teams) => (filters.value.requiredTeams = teams),
});

const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));
const categoryItems = computed<string[]>(() => [
  ...Object.values(TaskPriorities),
  ...displayableCategories,
]);

const updateSearchParam = useDebounceFn((value: string | null) => {
  updateQueryParams(TASK_SEARCH_QUERY_PARAM, value);
}, 200);
const updateRequiredTeamsParam = (teams: Team[]) => {
  updateQueryParams(
    REQUIRED_TEAMS_QUERY_PARAM,
    teams.map(({ code }) => code),
  );
};
const updateInChargeTeamParam = (team?: Team | null) => {
  updateQueryParams(IN_CHARGE_TEAM_QUERY_PARAM, team?.code);
};
const updateCategoryParam = (
  selectedCategory: DisplayableCategory | TaskPriority | undefined,
) => {
  updateQueryParams(TASK_CATEGORY_QUERY_PARAM, selectedCategory);
};
const updateHasAssignedFriendsParam = (enabled: boolean | null) => {
  updateQueryParams(HAS_ASSIGNED_FRIENDS_QUERY_PARAM, enabled);
};
const updatePastParam = (enabled: boolean | null) => {
  updateQueryParams(PAST_ASSIGNMENTS_QUERY_PARAM, enabled);
};
const updateCompletedParam = (enabled: boolean | null) => {
  updateQueryParams(COMPLETED_TASKS_QUERY_PARAM, enabled);
};

const counterLabel = computed<string>(() =>
  props.type === "FT"
    ? "Nombre de FT dans la liste : "
    : "Nombre de créneaux dans la liste : ",
);
</script>

<style lang="scss" scoped>
@use "~/assets/assignment.scss" as *;

.filters {
  width: 100%;
  padding: 5px 15px 0 15px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  &__field {
    width: 100%;
    overflow: visible;
  }
}
.stats {
  margin-bottom: 5px;
}

.filters-row {
  display: flex;
  gap: 0 10px;
  align-items: center;
  flex-wrap: wrap;
  &__switch {
    margin: -5px 0 -5px 10px;
  }
}
</style>
