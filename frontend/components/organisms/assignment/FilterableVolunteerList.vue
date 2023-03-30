<template>
  <v-card class="filterable-volunteer-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="volunteersLength"
        class="filters"
        @change:search="volunteer = $event"
        @change:teams="teams = $event"
      ></AssignmentFilters>
      <v-divider />
      <VolunteerList
        v-if="shouldShowVolunteerList"
        :volunteers="filteredVolunteers"
        class="volunteer-list"
        :class="shouldDisplayFriends ? 'volunteer-list--with-friend-list' : ''"
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
import VolunteerList from "~/components/molecules/assignment/VolunteerList.vue";
import FriendsDisplay from "~/components/molecules/friends/FriendsDisplay.vue";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import { Team } from "~/utils/models/team";
import {
  Volunteer,
  AssignmentModes,
  getAssignmentModeFromRoute,
} from "~/utils/models/assignment";
import { FtTimespan } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FilterableVolunteerList",
  components: { VolunteerList, FriendsDisplay, AssignmentFilters },
  data: () => ({
    teams: [],
    volunteer: "",
  }),
  computed: {
    filteredVolunteers(): Volunteer[] {
      const filteredVolunteers = this.$accessor.assignment.volunteers.filter(
        (volunteer) => this.filterVolunteerByTeams(this.teams)(volunteer)
      );
      return this.fuzzyFindVolunteer(filteredVolunteers, this.volunteer);
    },
    volunteersLength(): number {
      if (!this.shouldShowVolunteerList) return 0;
      return this.$accessor.assignment.volunteers.length;
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
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 140px;
$header-footer-height: 122px;
$friends-height: 160px;

.filterable-volunteer-list {
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

.volunteer-list,
.error-message {
  width: 100%;
  height: calc(100vh - #{$filters-height + $header-footer-height});
  display: flex;
  flex-direction: column;
}

.volunteer-list {
  overflow-y: auto;
  &--with-friend-list {
    max-height: calc(
      100vh - #{$filters-height + $header-footer-height + $friends-height}
    );
  }
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

.friend-list {
  max-width: 300px;
  height: $friends-height;
  position: fixed;
  bottom: 36px;
}
</style>
