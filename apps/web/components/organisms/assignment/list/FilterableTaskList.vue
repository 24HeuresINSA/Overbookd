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
        v-model="filters"
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
import { SlugifyService } from "@overbookd/slugify";
import type { TaskForAssignment } from "@overbookd/assignment";
import { TaskAssignmentFilterBuilder } from "~/utils/assignment/filters/task-assignment.filter";
import {
  matchTaskAssignmentFilters,
  type FilterableTask,
} from "~/utils/assignment/filters/task-assignment.matcher";
import { useRouteQueryFilters } from "~/utils/http/url-params.utils";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

const filters = useRouteQueryFilters((query) =>
  TaskAssignmentFilterBuilder.getFromRouteQuery(query),
);

const isSideBarClosed = ref<boolean>(false);
const toggleSideBar = () => {
  isSideBarClosed.value = !isSideBarClosed.value;
};

const toFilterableTask = (task: TaskForAssignment): FilterableTask => ({
  ...task,
  end: task.lastAssignmentEnd,
  searchable: SlugifyService.apply(`${task.id} ${task.name}`),
});

const filteredTasks = computed<TaskForAssignment[]>(() => {
  const tasks = filters.value.completed
    ? assignTaskToVolunteerStore.tasks.all
    : assignTaskToVolunteerStore.tasks.toAssign;
  const isMatching = matchTaskAssignmentFilters(filters.value);
  return tasks.filter((task) => isMatching(toFilterableTask(task)));
});

const shouldShowTaskList = computed<boolean>(
  () => filteredTasks.value.length > 0,
);
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
