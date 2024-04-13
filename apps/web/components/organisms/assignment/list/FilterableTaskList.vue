<template>
  <v-card class="filterable-task-list">
    <v-card-text class="filterable-task-list__text">
      <FtTimeSpanFilters
        :list-length="filteredTasks.length"
        class="filters"
        type="ft"
        @change:search="searchTask = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
        @change:completed="completed = $event"
      ></FtTimeSpanFilters>
      <v-divider />
      <TaskList :tasks="filteredTasks" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FtTimeSpanFilters from "~/components/molecules/assignment/filter/FtTimeSpanFilters.vue";
import TaskList from "~/components/molecules/assignment/list/TaskList.vue";
import { TaskCategory, TaskPriority } from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team.model";
import { TaskPriorities } from "~/utils/models/ft-time-span.model";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import { MissingAssignmentTask } from "@overbookd/assignment";

type FilterableTaskListData = {
  teams: Team[];
  searchTask: string;
  category: TaskCategory | TaskPriority | null;
  completed: boolean;
};

export default defineComponent({
  name: "FilterableTaskList",
  components: { FtTimeSpanFilters, TaskList },
  data: (): FilterableTaskListData => ({
    completed: false,
    teams: [],
    searchTask: "",
    category: null,
  }),
  computed: {
    tasks(): MissingAssignmentTask[] {
      return this.$accessor.assignTaskToVolunteer.tasks;
    },
    searchableTasks(): Searchable<MissingAssignmentTask>[] {
      return this.tasks.map((task) => ({
        ...task,
        searchable: SlugifyService.apply(`${task.id} ${task.name}`),
      }));
    },
    filteredTasks(): MissingAssignmentTask[] {
      return this.searchableTasks.filter((task) => {
        return (
          this.filterByTeamRequests(this.teams)(task) &&
          this.filterByCatergoryOrPriority(this.category)(task) &&
          this.filterByName(this.searchTask)(task)
        );
      });
    },
  },
  methods: {
    filterByTeamRequests(
      teamsSearched: Team[],
    ): (task: MissingAssignmentTask) => boolean {
      return teamsSearched.length > 0
        ? (task) =>
            teamsSearched.every((teamSearched) =>
              task.teams.some((teamCode) => teamSearched.code === teamCode),
            )
        : () => true;
    },
    isTaskPriority(
      category: TaskPriority | TaskCategory,
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterByCatergoryOrPriority(
      categorySearched: TaskCategory | TaskPriority | null,
    ): (task: MissingAssignmentTask) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterByCategory(categorySearched);
    },
    filterByCategory(
      categorySearched: TaskCategory,
    ): (task: MissingAssignmentTask) => boolean {
      return (task) => {
        if (categorySearched === "AUCUNE") return task.category === null;
        return task.category === categorySearched;
      };
    },
    filterByPriority(
      prioritySearched: TaskPriority,
    ): (task: MissingAssignmentTask) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (task) => task.topPriority === hasPriority;
    },
    filterByName(
      search: string,
    ): (task: Searchable<MissingAssignmentTask>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 225px;
$header-footer-height: 100px;

.filterable-task-list {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &__text {
    padding: 0;
  }
}

.filters {
  width: 100%;
  height: $filters-height;
}

.task-list {
  padding: 0 5px;
  height: calc(100vh - #{$filters-height + $header-footer-height});
}
</style>
