<template>
  <v-card class="filterable-volunteer-list">
    <v-card-text class="filterable-volunteer-list__text">
      <VolunteerFilters
        :list-length="filteredVolunteers.length"
        class="filters"
        @change:search="volunteer = $event"
        @change:teams="teams = $event"
        @change:sort="sort = $event"
      ></VolunteerFilters>
      <v-divider />
      <VolunteerList
        v-if="shouldShowVolunteerList"
        :volunteers="filteredVolunteers"
        class="volunteer-list"
        :class="shouldDisplayFriends ? 'volunteer-list--with-friend-list' : ''"
        @select-volunteer="handleVolunteerSelection"
      ></VolunteerList>
      <div v-else class="error-message">
        <p v-if="!selectedTimespan">Aucun créneau séléctionné</p>
        <p v-else>Aucun bénévole disponible pour ce créneau</p>
      </div>
      <FriendsDisplay v-if="shouldDisplayFriends" class="friend-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import VolunteerList from "~/components/molecules/assignment/list/VolunteerList.vue";
import FriendsDisplay from "~/components/molecules/friends/FriendsDisplay.vue";
import VolunteerFilters from "~/components/molecules/assignment/filter/VolunteerFilters.vue";
import { Team } from "~/utils/models/team";
import {
  Sort,
  Volunteer,
  AssignmentModes,
  getAssignmentModeFromRoute,
} from "~/utils/models/assignment";
import { FtTimespan } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FilterableVolunteerList",
  components: { VolunteerList, FriendsDisplay, VolunteerFilters },
  data: () => ({
    teams: [] as Team[],
    volunteer: "",
    sort: 0,
  }),
  computed: {
    filteredVolunteers(): Volunteer[] {
      const filteredVolunteers = this.$accessor.assignment.volunteers.filter(
        (volunteer) => this.filterVolunteerByTeams(this.teams)(volunteer)
      );
      const searchedVolunteers = this.fuzzyFindVolunteer(
        filteredVolunteers,
        this.volunteer
      );
      return this.sortVolunteers(searchedVolunteers);
    },
    isOrgaTaskMode(): boolean {
      return (
        getAssignmentModeFromRoute(this.$route.fullPath) ===
        AssignmentModes.ORGA_TASK
      );
    },
    hasSelectedVolunteer(): boolean {
      return !!this.$accessor.assignment.selectedVolunteer;
    },
    selectedTimespan(): FtTimespan | null {
      return this.$accessor.assignment.selectedTimespan;
    },
    shouldShowVolunteerList(): boolean {
      return (
        this.isOrgaTaskMode ||
        (this.selectedTimespan !== null && this.filteredVolunteers.length > 0)
      );
    },
    shouldDisplayFriends(): boolean {
      return this.isOrgaTaskMode && this.hasSelectedVolunteer;
    },
  },
  methods: {
    filterVolunteerByTeams(
      teamsSearched: Team[]
    ): (volunteer: Volunteer) => boolean {
      return teamsSearched.length > 0
        ? (volunteer) =>
            teamsSearched.every((teamSearched) =>
              volunteer.teams.some(
                (volunteerTeamCode) => teamSearched.code === volunteerTeamCode
              )
            )
        : () => true;
    },
    fuzzyFindVolunteer(volunteers: Volunteer[], search?: string): Volunteer[] {
      if (!search) return volunteers;
      const fuse = new Fuse(volunteers, {
        keys: ["firstname", "lastname"],
        threshold: 0.4,
      });
      return fuse.search(search).map((e) => e.item);
    },
    handleVolunteerSelection(volunteer: Volunteer) {
      if (this.isOrgaTaskMode) {
        this.$accessor.assignment.setSelectedVolunteer(volunteer);
        this.$accessor.assignment.fetchSelectedVolunteerFriends(volunteer.id);
        this.$accessor.assignment.fetchSelectedVolunteerPlanning(volunteer.id);
        return;
      }
      this.$accessor.assignment.startAssignment(volunteer);
    },
    sortVolunteers(volunteers: Volunteer[]) {
      return volunteers.sort((a, b) => {
        if (this.sort === Sort.NONE) return a.charisma - b.charisma;
        if (this.sort === Sort.ASC) return a.assignments - b.assignments;
        return b.assignments - a.assignments;
      });
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
  max-width: calc(20% - 10px);
  height: $friends-height;
  position: fixed;
  bottom: 36px;
}
</style>
