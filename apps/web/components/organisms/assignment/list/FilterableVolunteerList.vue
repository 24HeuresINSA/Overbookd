<template>
  <v-card class="filterable-volunteer-list">
    <v-card-text class="filterable-volunteer-list__text">
      <VolunteerFilters
        :list-length="displayedVolunteers.length"
        class="filters"
        @change:search="searchVolunteer = $event"
        @change:teams="teams = $event"
        @change:sort="sort = $event"
      ></VolunteerFilters>
      <v-divider />
      <AssignmentVolunteerList
        v-if="shouldShowVolunteerList"
        :volunteers="displayedVolunteers"
        class="volunteer-list"
        :class="isOrgaTaskMode ? 'volunteer-list--with-friend-list' : ''"
        @select-volunteer="handleVolunteerSelection"
      ></AssignmentVolunteerList>
      <div v-else class="error-message">
        <p v-if="!selectedTimeSpan">Aucun créneau séléctionné</p>
        <p v-else>Aucun bénévole disponible pour ce créneau</p>
      </div>
      <FriendsDisplay
        v-if="isOrgaTaskMode"
        class="friend-list"
        @select-volunteer="handleVolunteerSelection"
      ></FriendsDisplay>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import AssignmentVolunteerList from "~/components/molecules/assignment/list/AssignmentVolunteerList.vue";
import FriendsDisplay from "~/components/molecules/friend/FriendsDisplay.vue";
import VolunteerFilters from "~/components/molecules/assignment/filter/VolunteerFilters.vue";
import { Team } from "~/utils/models/team.model";
import {
  Sort,
  Volunteer,
  AssignmentModes,
  getAssignmentModeFromRoute,
} from "~/utils/models/assignment.model";
import { FtTimeSpan } from "~/utils/models/ft-time-span.model";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";

interface FilterableVolunteerListData {
  teams: Team[];
  searchVolunteer: string;
  sort: number;
}

export default Vue.extend({
  name: "FilterableVolunteerList",
  components: { AssignmentVolunteerList, FriendsDisplay, VolunteerFilters },
  data: (): FilterableVolunteerListData => ({
    teams: [],
    searchVolunteer: "",
    sort: 0,
  }),
  computed: {
    volunteers(): Volunteer[] {
      return this.$accessor.assignment.volunteers;
    },
    searchableVolunteers(): Searchable<Volunteer>[] {
      return this.volunteers.map((volunteer) => ({
        ...volunteer,
        searchable: SlugifyService.apply(
          `${volunteer.firstname} ${volunteer.lastname} ${volunteer.nickname}`,
        ),
      }));
    },
    displayedVolunteers(): Volunteer[] {
      const filteredVolunteers = this.searchableVolunteers.filter(
        (volunteer) => {
          return (
            this.filterVolunteerByTeams(this.teams)(volunteer) &&
            this.filterVolunteertByName(this.searchVolunteer)(volunteer)
          );
        },
      );
      return this.sortVolunteers(filteredVolunteers);
    },
    isOrgaTaskMode(): boolean {
      return (
        getAssignmentModeFromRoute(this.$route.path) ===
        AssignmentModes.ORGA_TASK
      );
    },
    hasSelectedVolunteer(): boolean {
      return !!this.$accessor.assignment.selectedVolunteer;
    },
    selectedTimeSpan(): FtTimeSpan | null {
      return this.$accessor.assignment.selectedTimeSpan;
    },
    shouldShowVolunteerList(): boolean {
      return (
        this.isOrgaTaskMode ||
        (this.selectedTimeSpan !== null && this.displayedVolunteers.length > 0)
      );
    },
  },
  methods: {
    filterVolunteerByTeams(
      teamsSearched: Team[],
    ): (volunteer: Volunteer) => boolean {
      return teamsSearched.length > 0
        ? (volunteer) =>
            teamsSearched.every((teamSearched) =>
              volunteer.teams.some(
                (volunteerTeamCode) => teamSearched.code === volunteerTeamCode,
              ),
            )
        : () => true;
    },
    handleVolunteerSelection(volunteer: Volunteer) {
      if (this.isOrgaTaskMode) {
        this.$accessor.assignment.selectVolunteer(volunteer);
        return;
      }
      this.$accessor.assignment.startAssignment(volunteer);
    },
    sortVolunteers(volunteers: Volunteer[]) {
      return volunteers.sort((a, b) => {
        if (this.sort === Sort.NONE) return a.charisma - b.charisma;
        if (this.sort === Sort.ASC) {
          return a.assignmentDuration - b.assignmentDuration;
        }
        return b.assignmentDuration - a.assignmentDuration;
      });
    },
    filterVolunteertByName(
      search: string,
    ): (timeSpan: Searchable<Volunteer>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 165px;
$header-footer-height: 100px;
$friends-height: 160px;

.filterable-volunteer-list {
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

.volunteer-list {
  padding: 0 5px;
  height: calc(100vh - #{$filters-height + $header-footer-height});
  &--with-friend-list {
    max-height: calc(
      100vh - #{$filters-height + $header-footer-height + $friends-height}
    );
  }
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

.friend-list {
  height: $friends-height;
}
</style>
