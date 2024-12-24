<template>
  <v-card class="filterable-assignment-list">
    <v-card-text class="filterable-assignment-list__text">
      <TaskFilters
        v-model:search="searchedTaskName"
        v-model:required-teams="searchedRequiredTeams"
        v-model:in-charge-team="searchedInChargeTeam"
        v-model:category="searchedCategory"
        v-model:has-assigned-friends="hasAssignedFriends"
        :list-length="filteredAssignments.length"
        class="filters"
      />
      <v-divider />
      <TaskAssignmentList
        v-if="shouldShowAssignmentList"
        :assignments="filteredAssignments"
        class="assignment-list"
      />
      <div v-else class="error-message">
        <p v-if="!selectedVolunteer">Aucun bénévole séléctionné</p>
        <p v-else>
          Aucun créneau disponible pour {{ selectedVolunteer.firstname }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import type { AssignmentSummaryWithTask } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import type { Team } from "@overbookd/team";
import type { DisplayableCategory } from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  type TaskPriority,
} from "~/utils/assignment/task-priority";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";

const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();

const searchedTaskName = ref<string>("");
const searchedRequiredTeams = ref<Team[]>([]);
const searchedInChargeTeam = ref<Team | undefined>();
const searchedCategory = ref<DisplayableCategory | TaskPriority | undefined>();
const hasAssignedFriends = ref<boolean>(false);

const filteredAssignments = computed<AssignmentSummaryWithTask[]>(() =>
  searchableAssignments.value.filter((assignment) => {
    return (
      keepMatchingSearchCriteria(searchedTaskName.value)(assignment) &&
      filterByRequiredTeams(searchedRequiredTeams.value)(assignment) &&
      filterByInChargeTeam(searchedInChargeTeam.value)(assignment) &&
      filterByCategoryOrPriority(searchedCategory.value)(assignment) &&
      filterByHasAssignedFriends(hasAssignedFriends.value)(assignment)
    );
  }),
);
const searchableAssignments = computed<Searchable<AssignmentSummaryWithTask>[]>(
  () =>
    assignVolunteerToTaskStore.assignments.map((assignment) => ({
      ...assignment,
      searchable: SlugifyService.apply(
        `${assignment.taskId} ${assignment.name}`,
      ),
    })),
);

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
const shouldShowAssignmentList = computed<boolean>(
  () => selectedVolunteer !== null && filteredAssignments.value.length > 0,
);

const filterByRequiredTeams = (
  searchedTeams: Team[],
): ((assignment: AssignmentSummaryWithTask) => boolean) => {
  return searchedTeams.length > 0
    ? (assignment) =>
        searchedTeams.every((searchedTeam) =>
          assignment.teams.some(({ team }) => searchedTeam.code === team),
        )
    : () => true;
};
const filterByInChargeTeam = (
  searchedInChargeTeam?: Team,
): ((assignment: AssignmentSummaryWithTask) => boolean) => {
  return (assignment) => {
    return !searchedInChargeTeam?.code
      ? true
      : searchedInChargeTeam?.code === assignment.inChargeTeam;
  };
};
const filterByCategoryOrPriority = (
  searchedCategory?: DisplayableCategory | TaskPriority,
): ((assignment: AssignmentSummaryWithTask) => boolean) => {
  if (!searchedCategory) return () => true;
  return isTaskPriority(searchedCategory)
    ? filterByPriority(searchedCategory)
    : filterByCategory(searchedCategory);
};
const isTaskPriority = (
  category: TaskPriority | DisplayableCategory,
): category is TaskPriority => {
  return Object.values(TaskPriorities).includes(category);
};
const filterByPriority = (
  searchedPriority: TaskPriority,
): ((assignment: AssignmentSummaryWithTask) => boolean) => {
  const hasPriority = searchedPriority === TaskPriorities.PRIORITAIRE;
  return ({ topPriority }) => topPriority === hasPriority;
};
const filterByCategory = (
  searchedCategory: DisplayableCategory,
): ((assignment: AssignmentSummaryWithTask) => boolean) => {
  return (assignment) => assignment.category === searchedCategory;
};
const filterByHasAssignedFriends = (
  hasAssignedFriends: boolean,
): ((assignment: AssignmentSummaryWithTask) => boolean) => {
  return ({ hasFriendsAssigned }) => !hasAssignedFriends || hasFriendsAssigned;
};
</script>

<style lang="scss" scoped>
@use "~/assets/assignment.scss" as *;

$filters-height: $task-list-filters-height;
$layout-padding: $card-margin * 2;
$column-margins: 30px;
$list-height: calc(
  100vh - $filters-height - $header-height - $layout-padding - $column-margins
);

.filterable-assignment-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  &__text {
    padding: 0;
  }
}

.filters {
  height: $filters-height;
}

.assignment-list {
  padding: 0 5px;
  height: $list-height;
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: $list-height;
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
