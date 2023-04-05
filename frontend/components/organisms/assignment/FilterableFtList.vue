<template>
  <v-card class="filterable-task-list">
    <v-card-text>
      <FtTimespanFilters
        :list-length="filteredFts.length"
        class="filters"
        type="ft"
        @change:search="ft = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
      ></FtTimespanFilters>
      <v-divider />
      <FtList :fts="filteredFts" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import FtTimespanFilters from "~/components/molecules/assignment/filter/FtTimespanFilters.vue";
import FtList from "~/components/molecules/assignment/list/FtList.vue";
import { TaskCategory, TaskPriority } from "~/utils/models/ftTimespan";
import { FtWithTimespan } from "~/utils/models/ftTimespan";
import { Team } from "~/utils/models/team";
import { TaskPriorities } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FilterableFtList",
  components: { FtTimespanFilters, FtList },
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
              ft.teamRequests.some(({ code }) => teamSearched.code === code)
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
$filters-height: 190px;
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
