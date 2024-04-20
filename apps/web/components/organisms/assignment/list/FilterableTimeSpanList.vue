<template>
  <v-card class="filterable-timespan-list">
    <v-card-text class="filterable-timespan-list__text">
      <TaskFilters
        :list-length="filteredTimeSpans.length"
        class="filters"
        @change:search="searchFtName = $event"
        @change:teams="teams = $event"
        @change:category="category = $event"
      ></TaskFilters>
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
import TaskFilters from "~/components/molecules/assignment/filter/TaskFilters.vue";
import FtTimeSpanList from "~/components/molecules/assignment/list/FtTimeSpanList.vue";
import { Volunteer } from "~/utils/models/assignment.model";
import {
  AvailableTimeSpan,
  SimplifiedFT,
  TaskPriorities,
  TaskPriority,
} from "~/utils/models/ft-time-span.model";
import { Team } from "~/utils/models/team.model";
import { AssignmentCandidate } from "~/domain/timespan-assignment/timeSpanAssignment";
import { Searchable } from "~/utils/search/search.utils";
import { SlugifyService } from "@overbookd/slugify";
import { DisplayableCategory } from "~/utils/assignment/task-category";

type FilterableTimeSpanListData = {
  teams: Team[];
  searchFtName: string;
  category: DisplayableCategory | TaskPriority | null;
};

export default Vue.extend({
  name: "FilterableTimeSpanList",
  components: { TaskFilters, FtTimeSpanList },
  data: (): FilterableTimeSpanListData => ({
    teams: [],
    searchFtName: "",
    category: null,
  }),
  computed: {
    timeSpans(): AvailableTimeSpan[] {
      return this.$accessor.assignment.timeSpans;
    },
    searchableTimeSpans(): Searchable<AvailableTimeSpan>[] {
      return this.timeSpans.map((timeSpan) => ({
        ...timeSpan,
        searchable: SlugifyService.apply(
          `${timeSpan.ft.id} ${timeSpan.ft.name}`,
        ),
      }));
    },
    filteredTimeSpans(): AvailableTimeSpan[] {
      return this.searchableTimeSpans
        .filter((timeSpan) => this.isMatchingFilter(timeSpan))
        .map((timeSpan) => this.removeUnavailableTeamRequests(timeSpan));
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
      categorySearched: DisplayableCategory | TaskPriority | null,
    ): (ft: SimplifiedFT) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterFtByCategory(categorySearched);
    },
    isTaskPriority(
      category: TaskPriority | DisplayableCategory,
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterFtByCategory(
      categorySearched: DisplayableCategory,
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
    isMatchingFilter(timeSpan: Searchable<AvailableTimeSpan>): boolean {
      return (
        this.hasAssignableSlotsAvailable(timeSpan) &&
        this.filterTimeSpansByTeams(this.teams)(timeSpan) &&
        this.filterFtByCatergoryOrPriority(this.category)(timeSpan.ft) &&
        this.filterTimeSpanByFtName(this.searchFtName)(timeSpan)
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
    filterTimeSpanByFtName(
      search: string,
    ): (timeSpan: Searchable<AvailableTimeSpan>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 225px;
$column-margins: 30px;
$layout-padding: 20px;

.filterable-timespan-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  &__text {
    padding: 0;
  }
}

.filters {
  height: $filters-height;
}

.timespan-list {
  padding: 0 5px;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding} -
      #{$column-margins}
  );
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding} -
      #{$column-margins}
  );
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
