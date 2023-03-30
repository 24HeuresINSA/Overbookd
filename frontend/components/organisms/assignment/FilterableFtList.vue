<template>
  <v-card class="filterable-task-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="filteredFts.length"
        class="filters"
        type="ft"
        @change:search="ft = $event"
        @change:teams="teams = $event"
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
  getRequiredTeamsInFt,
} from "~/utils/models/ftTimespan";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "FilterableFtList",
  components: { AssignmentFilters, FtList },
  data: () => ({
    teams: [],
    ft: "",
  }),
  computed: {
    filteredFts(): FtWithTimespan[] {
      const filteredFts = this.$accessor.assignment.fts.filter((ft) =>
        this.filterFtByTeamRequests(this.teams)(ft)
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
$header-footer-height: 122px;

.filterable-task-list {
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  .v-card__text {
    height: fit-content;
  }
}

.filters {
  width: 100%;
  height: $filters-height;
}

.task-list {
  width: 100%;
  height: calc(100vh - #{$filters-height + $header-footer-height});
  display: flex;
  flex-direction: column;
}
</style>
