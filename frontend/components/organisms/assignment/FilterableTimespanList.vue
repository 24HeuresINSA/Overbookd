<template>
  <v-card class="filterable-timespan-list">
    <v-card-text>
      <FtTimespanFilters
        :list-length="filteredTimespans.length"
        class="filters"
        @change:search="timespan = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
      ></FtTimespanFilters>
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
import FtTimespanFilters from "~/components/molecules/assignment/filter/FtTimespanFilters.vue";
import FtTimespanList from "~/components/molecules/assignment/list/FtTimespanList.vue";
import { Volunteer } from "~/utils/models/assignment";
import {
  SimplifiedFT,
  TaskCategory,
  TaskPriorities,
  TaskPriority,
  TimespanWithFt,
} from "~/utils/models/ftTimespan";
import { Team } from "~/utils/models/team";
import { AssignmentCandidate } from "~/domain/timespan-assignment/timespanAssignment";

export default Vue.extend({
  name: "FilterableTimespanList",
  components: { FtTimespanFilters, FtTimespanList },
  data: () => ({
    teams: [] as Team[],
    timespan: "",
    category: null as TaskCategory | TaskPriority | null,
  }),
  computed: {
    filteredTimespans(): TimespanWithFt[] {
      const filteredTimespans = this.$accessor.assignment.timespans
        .filter((timespan) => this.isMatchingFilter(timespan))
        .map((timespan) => this.removeUnavailableTeamRequests(timespan));
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
    filterFtByCatergoryOrPriority(
      categorySearched: TaskCategory | TaskPriority | null
    ): (ft: SimplifiedFT) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterFtByCategory(categorySearched);
    },
    isTaskPriority(
      category: TaskPriority | TaskCategory
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterFtByCategory(
      categorySearched: TaskCategory
    ): (ft: SimplifiedFT) => boolean {
      return (ft) => ft.category === categorySearched;
    },
    filterByPriority(
      prioritySearched: TaskPriority
    ): (ft: SimplifiedFT) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (ft) => ft.hasPriority === hasPriority;
    },
    isVolunteerAssignableTo(teamCode: string): boolean {
      if (!this.selectedVolunteer) return false;
      const candidate = new AssignmentCandidate(this.selectedVolunteer);
      return candidate.canBeAssignedAs(teamCode);
    },
    removeUnavailableTeamRequests(timespan: TimespanWithFt): TimespanWithFt {
      const requestedTeams = timespan.requestedTeams.filter(({ code }) =>
        this.isVolunteerAssignableTo(code)
      );
      return {
        ...timespan,
        requestedTeams,
      };
    },
    isMatchingFilter(timespan: TimespanWithFt): boolean {
      return (
        this.hasSlotsAvailable(timespan) &&
        this.filterTimespansByTeams(this.teams)(timespan) &&
        this.filterFtByCatergoryOrPriority(this.category)(timespan.ft)
      );
    },
    hasSlotsAvailable(timespan: TimespanWithFt): boolean {
      return timespan.requestedTeams.some(
        ({ quantity, assignmentCount }) => quantity > assignmentCount
      );
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
$filters-height: 190px;
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
