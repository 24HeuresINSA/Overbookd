<template>
  <v-card class="filterable-task-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="filteredFts.length"
        class="filters"
        type="ft"
        @change:search="ft = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
      ></AssignmentFilters>
      <v-divider />
      <FtList :fts="filteredFts" class="task-list"></FtList>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import FtList from "~/components/molecules/assignment/FtList.vue";
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
  components: { AssignmentFilters, FtList },
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
    isTaskPriority(): boolean {
      return Object.values(TaskPriorities).includes(
        this.category as TaskPriority
      );
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
    filterFtByCatergoryOrPriority(
      categorySearched: TaskCategory | TaskPriority | null
    ): (ft: FtWithTimespan) => boolean {
      return categorySearched
        ? this.isTaskPriority
          ? this.filterByPriority(categorySearched as TaskPriority)
          : this.filterFtByCategory(categorySearched as TaskCategory)
        : () => true;
    },
    filterFtByCategory(
      categorySearched: TaskCategory | null
    ): (ft: FtWithTimespan) => boolean {
      return categorySearched
        ? (ft) => ft.category === categorySearched
        : () => true;
    },
    filterByPriority(
      prioritySearched: TaskPriority | null
    ): (ft: FtWithTimespan) => boolean {
      if (prioritySearched === null) return () => true;
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
$filters-height: 140px;
$header-footer-height: 100px;
$card-padding: 32px;

.filterable-task-list {
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

.filters {
  width: 100%;
  height: $filters-height;
}

.task-list {
  width: 100%;
  height: calc(
    100vh - #{$filters-height + $header-footer-height + $card-padding}
  );
  display: flex;
  flex-direction: column;
}
</style>
