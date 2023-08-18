<template>
  <v-card class="filterable-timespan-list">
    <v-card-text class="filterable-timespan-list__text">
      <FtTimeSpanFilters
        :list-length="filteredTimeSpans.length"
        class="filters"
        @change:search="timeSpan = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
      ></FtTimeSpanFilters>
      <v-divider />
      <FtTimeSpanList
        v-if="shouldShowTimeSpanList"
        :time-spans="filteredTimeSpans"
        class="timespan-list"
      ></FtTimeSpanList>
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
import FtTimeSpanFilters from "~/components/molecules/assignment/filter/FtTimeSpanFilters.vue";
import FtTimeSpanList from "~/components/molecules/assignment/list/FtTimeSpanList.vue";
import { Volunteer } from "~/utils/models/assignment.model";
import {
  AvailableTimeSpan,
  SimplifiedFT,
  TaskCategory,
  TaskPriorities,
  TaskPriority,
} from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team";
import { AssignmentCandidate } from "~/domain/timespan-assignment/timeSpanAssignment";

export default Vue.extend({
  name: "FilterableTimeSpanList",
  components: { FtTimeSpanFilters, FtTimeSpanList },
  data: () => ({
    teams: [] as Team[],
    timeSpan: "",
    category: null as TaskCategory | TaskPriority | null,
  }),
  computed: {
    filteredTimeSpans(): AvailableTimeSpan[] {
      const filteredTimeSpans = this.$accessor.assignment.timeSpans
        .filter((timeSpan) => this.isMatchingFilter(timeSpan))
        .map((timeSpan) => this.removeUnavailableTeamRequests(timeSpan));
      return this.fuzzyFindTimeSpan(filteredTimeSpans, this.timeSpan);
    },
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
    shouldShowTimeSpanList(): boolean {
      return (
        this.selectedVolunteer !== null && this.filteredTimeSpans.length > 0
      );
    },
  },
  methods: {
    filterTimeSpansByTeams(
      teamsSearched: Team[],
    ): (timeSpan: AvailableTimeSpan) => boolean {
      return teamsSearched.length > 0
        ? (timeSpan) =>
            teamsSearched.every((teamSearched) =>
              timeSpan.requestedTeams.some(
                (timeSpanTeam) => teamSearched.code === timeSpanTeam.code,
              ),
            )
        : () => true;
    },
    filterFtByCatergoryOrPriority(
      categorySearched: TaskCategory | TaskPriority | null,
    ): (ft: SimplifiedFT) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterFtByCategory(categorySearched);
    },
    isTaskPriority(
      category: TaskPriority | TaskCategory,
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterFtByCategory(
      categorySearched: TaskCategory,
    ): (ft: SimplifiedFT) => boolean {
      return (ft) => ft.category === categorySearched;
    },
    filterByPriority(
      prioritySearched: TaskPriority,
    ): (ft: SimplifiedFT) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (ft) => ft.hasPriority === hasPriority;
    },
    isVolunteerAssignableTo(teamCode: string): boolean {
      if (!this.selectedVolunteer) return false;
      const candidate = new AssignmentCandidate(this.selectedVolunteer);
      return candidate.canBeAssignedAs(teamCode);
    },
    removeUnavailableTeamRequests(
      timeSpan: AvailableTimeSpan,
    ): AvailableTimeSpan {
      const requestedTeams = timeSpan.requestedTeams.filter(
        ({ code, quantity, assignmentCount }) =>
          this.isVolunteerAssignableTo(code) && quantity > assignmentCount,
      );
      return {
        ...timeSpan,
        requestedTeams,
      };
    },
    isMatchingFilter(timeSpan: AvailableTimeSpan): boolean {
      return (
        this.hasAssignableSlotsAvailable(timeSpan) &&
        this.filterTimeSpansByTeams(this.teams)(timeSpan) &&
        this.filterFtByCatergoryOrPriority(this.category)(timeSpan.ft)
      );
    },
    hasAssignableSlotsAvailable(timeSpan: AvailableTimeSpan): boolean {
      return timeSpan.requestedTeams.some(
        ({ code, quantity, assignmentCount }) => {
          if (!this.selectedVolunteer) return false;
          const candidate = new AssignmentCandidate(this.selectedVolunteer);
          return quantity > assignmentCount && candidate.canBeAssignedAs(code);
        },
      );
    },
    fuzzyFindTimeSpan(
      timeSpans: AvailableTimeSpan[],
      search?: string,
    ): AvailableTimeSpan[] {
      if (!search) return timeSpans;
      const fuse = new Fuse(timeSpans, {
        keys: ["ft.id", "ft.name"],
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
$card-padding: 32px;

.filterable-timespan-list {
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

.timespan-list {
  padding: 0 5px;
  height: calc(100vh - #{$filters-height + $header-footer-height});
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: calc(100vh - #{$filters-height + $header-footer-height});
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
