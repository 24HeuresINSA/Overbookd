<template>
  <v-card class="filterable-task-list" :class="{ closed: isSideBarClosed }">
    <v-btn
      icon="mdi-chevron-right"
      :aria-label="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la liste de tâches`"
      :title="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la liste de tâches`"
      variant="flat"
      density="compact"
      class="btn-close-side-bar"
      :class="{ 'rotate-180': isSideBarClosed }"
      @click="toggleSideBar"
    />

    <v-card-text v-if="!isSideBarClosed" class="filterable-task-list__text">
      <TaskFilters
        v-model:search="searchedTaskName"
        v-model:required-teams="searchedRequiredTeams"
        v-model:in-charge-team="searchedInChargeTeam"
        v-model:category="searchedCategory"
        v-model:completed="displayCompleted"
        :list-length="filteredTasks.length"
        class="filters"
      />
      <v-divider />
      <TaskList v-if="shouldShowTaskList" :tasks="filteredTasks" />
      <div v-else class="error-message">
        <p>Aucune tâche à affecter</p>
      </div>
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
import type { TaskForAssignment } from "@overbookd/assignment";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

const searchedTaskName = ref<string>("");
const searchedRequiredTeams = ref<Team[]>([]);
const searchedInChargeTeam = ref<Team | undefined>();
const searchedCategory = ref<DisplayableCategory | TaskPriority | undefined>();
const displayCompleted = ref<boolean>(false);

const isSideBarClosed = ref<boolean>(false);
const toggleSideBar = () => {
  isSideBarClosed.value = !isSideBarClosed.value;
};

const toSearchableTask = (
  task: TaskForAssignment,
): Searchable<TaskForAssignment> => ({
  ...task,
  searchable: SlugifyService.apply(`${task.id} ${task.name}`),
});

const searchableTasks = computed<Searchable<TaskForAssignment>[]>(() => {
  const tasks = displayCompleted.value
    ? assignTaskToVolunteerStore.tasks.all
    : assignTaskToVolunteerStore.tasks.toAssign;

  return tasks.map(toSearchableTask);
});

const filteredTasks = computed<TaskForAssignment[]>(() =>
  searchableTasks.value.filter((task) => {
    return (
      keepMatchingSearchCriteria(searchedTaskName.value)(task) &&
      filterByRequiredTeams(searchedRequiredTeams.value)(task) &&
      filterByInChargeTeam(searchedInChargeTeam.value)(task) &&
      filterByCategoryOrPriority(searchedCategory.value)(task)
    );
  }),
);

const shouldShowTaskList = computed<boolean>(
  () => filteredTasks.value.length > 0,
);

const filterByRequiredTeams = (
  searchedTeams: Team[],
): ((task: TaskForAssignment) => boolean) => {
  return searchedTeams.length > 0
    ? (task) =>
        searchedTeams.every((team) =>
          task.teams.some((teamCode) => team.code === teamCode),
        )
    : () => true;
};
const filterByInChargeTeam = (
  teamSearched: Team | undefined,
): ((task: TaskForAssignment) => boolean) => {
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
): ((task: TaskForAssignment) => boolean) => {
  if (!categorySearched) return () => true;
  return isTaskPriority(categorySearched)
    ? filterByPriority(categorySearched)
    : filterByCategory(categorySearched);
};
const filterByCategory = (
  categorySearched: DisplayableCategory,
): ((task: TaskForAssignment) => boolean) => {
  return (task) => {
    if (categorySearched === "AUCUNE") return task.category === null;
    return task.category === categorySearched;
  };
};
const filterByPriority = (
  prioritySearched: TaskPriority,
): ((task: TaskForAssignment) => boolean) => {
  const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
  return (task) => task.topPriority === hasPriority;
};
</script>

<style lang="scss" scoped>
.filterable-task-list {
  min-height: 100%;

  width: 420px;
  transition: width 0.3s ease;

  &.closed {
    width: 30px;
  }

  &__text {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0;
  }
}

.btn-close-side-bar {
  position: absolute;
  top: 16px;
  left: -3px;

  &.rotate-180 {
    left: 0;
  }
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.filters {
  flex-shrink: 0;
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: 100%;
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
