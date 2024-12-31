<template>
  <v-card class="filterable-task-list">
    <v-card-text class="filterable-task-list__text">
      <TaskFilters
        v-model:search="searchedTaskName"
        v-model:required-teams="searchedRequiredTeams"
        v-model:in-charge-team="searchedInChargeTeam"
        v-model:category="searchedCategory"
        v-model:has-assigned-friends="hasAssignedFriends"
        :list-length="filteredTasks.length"
        class="filters"
      />
      <v-divider />
      <TaskList :tasks="filteredTasks" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {
  type TaskPriority,
  TaskPriorities,
} from "~/utils/assignment/task-priority";
import { SlugifyService } from "@overbookd/slugify";
import type { Team } from "@overbookd/team";
import type { DisplayableCategory } from "~/utils/assignment/task-category";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import type { MissingAssignmentTask } from "@overbookd/assignment";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

const searchedTaskName = ref<string>("");
const searchedRequiredTeams = ref<Team[]>([]);
const searchedInChargeTeam = ref<Team | undefined>();
const searchedCategory = ref<DisplayableCategory | TaskPriority | undefined>();
const hasAssignedFriends = ref<boolean>(false);

const searchableTasks = computed<Searchable<MissingAssignmentTask>[]>(() =>
  assignTaskToVolunteerStore.tasks.map((task) => ({
    ...task,
    searchable: SlugifyService.apply(`${task.id} ${task.name}`),
  })),
);
const filteredTasks = computed<MissingAssignmentTask[]>(() =>
  searchableTasks.value.filter((task) => {
    return (
      keepMatchingSearchCriteria(searchedTaskName.value)(task) &&
      filterByRequiredTeams(searchedRequiredTeams.value)(task) &&
      filterByInChargeTeam(searchedInChargeTeam.value)(task) &&
      filterByCategoryOrPriority(searchedCategory.value)(task)
    );
  }),
);

const filterByRequiredTeams = (
  searchedTeams: Team[],
): ((task: MissingAssignmentTask) => boolean) => {
  return searchedTeams.length > 0
    ? (task) =>
        searchedTeams.every((team) =>
          task.teams.some((teamCode) => team.code === teamCode),
        )
    : () => true;
};
const filterByInChargeTeam = (
  teamSearched: Team | undefined,
): ((task: MissingAssignmentTask) => boolean) => {
  return (task) => {
    return !teamSearched?.code
      ? true
      : teamSearched?.code === task.inChargeTeam;
  };
};
const isTaskPriority = (
  category: DisplayableCategory | TaskPriority,
): category is TaskPriority => {
  return Object.values(TaskPriorities).includes(category);
};
const filterByCategoryOrPriority = (
  categorySearched: DisplayableCategory | TaskPriority | undefined,
): ((task: MissingAssignmentTask) => boolean) => {
  if (!categorySearched) return () => true;
  return isTaskPriority(categorySearched)
    ? filterByPriority(categorySearched)
    : filterByCategory(categorySearched);
};
const filterByCategory = (
  categorySearched: DisplayableCategory,
): ((task: MissingAssignmentTask) => boolean) => {
  return (task) => {
    if (categorySearched === "AUCUNE") return task.category === null;
    return task.category === categorySearched;
  };
};
const filterByPriority = (
  prioritySearched: TaskPriority,
): ((task: MissingAssignmentTask) => boolean) => {
  const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
  return (task) => task.topPriority === hasPriority;
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

.filterable-task-list {
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

.task-list {
  padding: 0 5px;
  height: $list-height;
}
</style>
