<template>
  <v-card class="filterable-task-list">
    <v-card-text class="filterable-task-list__text">
      <FtTimespanFilters
        :list-length="filteredFts.length"
        class="filters"
        type="ft"
        @change:search="ft = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
      ></FtTimespanFilters>
      <v-divider />
      <TaskList :fts="filteredFts" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import FtTimespanFilters from "~/components/molecules/assignment/filter/FtTimespanFilters.vue";
import TaskList from "~/components/molecules/assignment/list/TaskList.vue";
import {
  FtWithTimespan,
  TaskCategory,
  TaskPriority,
  getRequiredTeamsInFt,
} from "~/utils/models/ftTimespan";
import { Team } from "~/utils/models/team";
import { TaskPriorities } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FilterableFtList",
  components: { FtTimespanFilters, TaskList },
  data: () => ({
    teams: [] as Team[],
    ft: "",
    category: null as TaskCategory | TaskPriority | null,
  }),
  computed: {
    filteredFts(): FtWithTimespan[] {
      const filteredFts = this.$accessor.assignment.assignableFts.filter(
        (ft) => {
          return (
            this.filterFtByTeamRequests(this.teams)(ft) &&
            this.filterFtByCatergoryOrPriority(this.category)(ft)
          );
        }
      );
      return this.fuzzyFindFt(filteredFts, this.ft);
    },
  },
  methods: {
    filterFtByTeamRequests(
      teamsSearched: Team[]
    ): (ft: FtWithTimespan) => boolean {
      return teamsSearched.length > 0
        ? (ft) =>
            teamsSearched.every((teamSearched) =>
              getRequiredTeamsInFt(ft).some(
                (timespanTeamCode) => teamSearched.code === timespanTeamCode
              )
            )
        : () => true;
    },
    isTaskPriority(
      category: TaskPriority | TaskCategory
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterFtByCatergoryOrPriority(
      categorySearched: TaskCategory | TaskPriority | null
    ): (ft: FtWithTimespan) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterFtByCategory(categorySearched);
    },
    filterFtByCategory(
      categorySearched: TaskCategory
    ): (ft: FtWithTimespan) => boolean {
      return (ft) => ft.category === categorySearched;
    },
    filterByPriority(
      prioritySearched: TaskPriority
    ): (ft: FtWithTimespan) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (ft) => ft.hasPriority === hasPriority;
    },
    fuzzyFindFt(fts: FtWithTimespan[], search?: string): FtWithTimespan[] {
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
$filters-height: 215px;
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
  height: $filters-height - 25px;
}

.task-list {
  padding: 0 5px;
  height: calc(100vh - #{$filters-height + $header-footer-height});
}
</style>
