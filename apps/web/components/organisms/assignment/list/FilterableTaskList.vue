<template>
  <v-card class="filterable-task-list">
    <v-card-text class="filterable-task-list__text">
      <FtTimeSpanFilters
        :list-length="filteredFts.length"
        class="filters"
        type="ft"
        @change:search="ft = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
        @change:completed="completed = $event"
      ></FtTimeSpanFilters>
      <v-divider />
      <TaskList :fts="filteredFts" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import FtTimeSpanFilters from "~/components/molecules/assignment/filter/FtTimeSpanFilters.vue";
import TaskList from "~/components/molecules/assignment/list/TaskList.vue";
import {
  FtWithTimeSpan,
  TaskCategory,
  TaskPriority,
  getRequiredTeamsInFt,
} from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team";
import { TaskPriorities } from "~/utils/models/ft-time-span.model";

export default Vue.extend({
  name: "FilterableTaskList",
  components: { FtTimeSpanFilters, TaskList },
  data: () => ({
    completed: false,
    teams: [] as Team[],
    ft: "",
    category: null as TaskCategory | TaskPriority | null,
  }),
  computed: {
    filteredFts(): FtWithTimeSpan[] {
      const filteredFts = this.$accessor.assignment.fts.filter((ft) => {
        return (
          this.filterFtByTeamRequests(this.teams)(ft) &&
          this.filterFtByCatergoryOrPriority(this.category)(ft) &&
          this.filterFtByQuantity(ft)
        );
      });
      return this.fuzzyFindFt(filteredFts, this.ft);
    },
  },
  methods: {
    filterFtByTeamRequests(
      teamsSearched: Team[],
    ): (ft: FtWithTimeSpan) => boolean {
      return teamsSearched.length > 0
        ? (ft) =>
            teamsSearched.every((teamSearched) =>
              getRequiredTeamsInFt(ft).some(
                (timeSpanTeamCode) => teamSearched.code === timeSpanTeamCode,
              ),
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
    ): (ft: FtWithTimeSpan) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterFtByCategory(categorySearched);
    },
    filterFtByCategory(
      categorySearched: TaskCategory,
    ): (ft: FtWithTimeSpan) => boolean {
      return (ft) => {
        if (categorySearched === "AUCUNE") return ft.category === null;
        return ft.category === categorySearched;
      };
    },
    filterByPriority(
      prioritySearched: TaskPriority,
    ): (ft: FtWithTimeSpan) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (ft) => ft.hasPriority === hasPriority;
    },
    filterFtByQuantity({ timeSpans }: FtWithTimeSpan): boolean {
      if (this.completed) return true;
      return timeSpans.some(({ requestedTeams }) =>
        requestedTeams.some(
          ({ quantity, assignmentCount }) => quantity > assignmentCount,
        ),
      );
    },
    fuzzyFindFt(fts: FtWithTimeSpan[], search?: string): FtWithTimeSpan[] {
      if (!search) return fts;
      const fuse = new Fuse(fts, {
        keys: ["id", "name"],
        threshold: 0.4,
      });
      return fuse.search(search).map((e) => e.item);
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
