<template>
  <v-card class="filterable-timespan-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="filteredTimespans.length"
        class="filters"
        type="timespan"
        @change:search="timespan = $event"
        @change:teams="teams = $event"
      ></AssignmentFilters>
      <v-divider />
      <FtTimespanList
        v-if="shouldShowTimespanList"
        :timespans="filteredTimespans"
        class="timespan-list"
      ></FtTimespanList>
      <div v-else class="error-message">
        <p v-if="!selectedVolunteer">Aucun bénévole séléctionné</p>
        <p v-else>
          Aucun créneau disponible pour {{ selectedVolunteer.firstname }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import FtTimespanList from "~/components/molecules/assignment/FtTimespanList.vue";
import { Volunteer } from "~/utils/models/assignment";
import { TimespanWithFt } from "~/utils/models/ftTimespan";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "FilterableTimespanList",
  components: { AssignmentFilters, FtTimespanList },
  data: () => ({
    teams: [],
    timespan: "",
  }),
  computed: {
    filteredTimespans(): TimespanWithFt[] {
      const filteredTimespans = this.$accessor.assignment.timespans.filter(
        (timespan) => this.filterTimespansByTeams(this.teams)(timespan)
      );
      return this.fuzzyFindTimespan(filteredTimespans, this.timespan);
    },
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
    shouldShowTimespanList(): boolean {
      return (
        this.selectedVolunteer !== null && this.filteredTimespans.length > 0
      );
    },
  },
  methods: {
    filterTimespansByTeams(
      teamsSearched: Team[]
    ): (timespan: TimespanWithFt) => boolean {
      return teamsSearched.length > 0
        ? (timespan) =>
            teamsSearched.every((teamSearched) =>
              timespan.requestedTeams.some(
                (timespanTeam) => teamSearched.code === timespanTeam.code
              )
            )
        : () => true;
    },
    fuzzyFindTimespan(
      timespans: TimespanWithFt[],
      search?: string
    ): TimespanWithFt[] {
      if (!search) return timespans;
      const fuse = new Fuse(timespans, {
        keys: ["ft.id", "ft.name"],
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

.filterable-timespan-list {
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
}

.filters {
  width: 100%;
  height: $filters-height;
}

.timespan-list,
.error-message {
  width: 100%;
  height: calc(
    100vh - #{$filters-height + $header-footer-height + $card-padding}
  );
  display: flex;
  flex-direction: column;
}

.error-message {
  align-items: center;
  justify-content: center;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
