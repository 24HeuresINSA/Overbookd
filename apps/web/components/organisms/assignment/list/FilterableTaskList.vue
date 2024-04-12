<template>
  <v-card class="filterable-task-list">
    <v-card-text class="filterable-task-list__text">
      <FtTimeSpanFilters
        :list-length="filteredFts.length"
        class="filters"
        type="ft"
        @change:search="searchFt = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
        @change:completed="completed = $event"
      ></FtTimeSpanFilters>
      <v-divider />
      <TaskList :tasks="filteredFts" class="task-list" />
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
  searchFt: string;
  category: TaskCategory | TaskPriority | null;
  completed: boolean;
};

export default defineComponent({
  name: "FilterableTaskList",
  components: { FtTimeSpanFilters, TaskList },
  data: (): FilterableTaskListData => ({
    completed: false,
    teams: [],
    searchFt: "",
    category: null,
  }),
  computed: {
    tasks(): MissingAssignmentTask[] {
      return this.$accessor.assignment.taskToVolunteer.tasks;
    },
    searchableFts(): Searchable<MissingAssignmentTask>[] {
      return this.tasks.map((ft) => ({
        ...ft,
        searchable: SlugifyService.apply(`${ft.id} ${ft.name}`),
      }));
    },
    filteredFts(): MissingAssignmentTask[] {
      return this.searchableFts.filter((ft) => {
        return (
          this.filterFtByTeamRequests(this.teams)(ft) &&
          this.filterFtByCatergoryOrPriority(this.category)(ft) &&
          this.filterFtByName(this.searchFt)(ft)
        );
      });
    },
  },
  methods: {
    filterFtByTeamRequests(
      teamsSearched: Team[],
    ): (ft: MissingAssignmentTask) => boolean {
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
    filterFtByCatergoryOrPriority(
      categorySearched: TaskCategory | TaskPriority | null,
    ): (ft: MissingAssignmentTask) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterFtByCategory(categorySearched);
    },
    filterFtByCategory(
      categorySearched: TaskCategory,
    ): (ft: MissingAssignmentTask) => boolean {
      return (ft) => {
        if (categorySearched === "AUCUNE") return ft.category === null;
        return ft.category === categorySearched;
      };
    },
    filterByPriority(
      prioritySearched: TaskPriority,
    ): (ft: MissingAssignmentTask) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (ft) => ft.topPriority === hasPriority;
    },
    filterFtByName(
      search: string,
    ): (timeSpan: Searchable<MissingAssignmentTask>) => boolean {
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
