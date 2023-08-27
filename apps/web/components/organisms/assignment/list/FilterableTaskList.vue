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
      <TaskList :fts="filteredFts" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import FtTimeSpanFilters from "~/components/molecules/assignment/filter/FtTimeSpanFilters.vue";
import TaskList from "~/components/molecules/assignment/list/TaskList.vue";
import {
  FtWithTimeSpan,
  TaskCategory,
  TaskPriority,
  getRequiredTeamsInFt,
} from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team.model";
import { TaskPriorities } from "~/utils/models/ft-time-span.model";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";

interface FilterableTaskListData {
  teams: Team[];
  searchFt: string;
  category: TaskCategory | TaskPriority | null;
  completed: boolean;
}

export default Vue.extend({
  name: "FilterableTaskList",
  components: { FtTimeSpanFilters, TaskList },
  data: (): FilterableTaskListData => ({
    completed: false,
    teams: [],
    searchFt: "",
    category: null,
  }),
  computed: {
    fts(): FtWithTimeSpan[] {
      return this.$accessor.assignment.fts;
    },
    searchableFts(): Searchable<FtWithTimeSpan>[] {
      return this.fts.map((ft) => ({
        ...ft,
        searchable: SlugifyService.apply(`${ft.id} ${ft.name}`),
      }));
    },
    filteredFts(): FtWithTimeSpan[] {
      return this.searchableFts.filter((ft) => {
        return (
          this.filterFtByTeamRequests(this.teams)(ft) &&
          this.filterFtByCatergoryOrPriority(this.category)(ft) &&
          this.filterFtByQuantity(ft) &&
          this.filterFtByName(this.searchFt)(ft)
        );
      });
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
    filterFtByName(
      search: string,
    ): (timeSpan: Searchable<FtWithTimeSpan>) => boolean {
      return ({ searchable }) => searchable.includes(search);
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
