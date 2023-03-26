<template>
  <v-card class="filterable-user-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="filteredVolunteers.length"
        class="filters"
        @change:search="volunteer = $event"
        @change:teams="teams = $event"
      ></AssignmentFilters>
      <v-divider />
      <div
        class="user-list"
        :class="shouldDisplayFriends ? 'user-list__with-friend-list' : ''"
      >
        <UserList :volunteers="filteredVolunteers" />
      </div>
      <FriendsDisplay v-if="shouldDisplayFriends" class="friend-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import UserList from "~/components/molecules/users/UserList.vue";
import FriendsDisplay from "~/components/molecules/friends/FriendsDisplay.vue";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import { Team } from "~/utils/models/team";
import { Volunteer, AssignmentModes } from "~/utils/models/assignment";

export default Vue.extend({
  name: "FilterableVolunteerList",
  components: { UserList, FriendsDisplay, AssignmentFilters },
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
    isOrgaTaskMode(): boolean {
      return this.$accessor.assignment.mode === AssignmentModes.ORGA_TASK;
    },
    hasSelectedVolunteer(): boolean {
      return !!this.$accessor.assignment.selectedVolunteer;
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
            volunteer.teams
              .map((team) => team)
              .some((code) =>
                teamsSearched.map((team) => team.code).includes(code)
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
.filterable-user-list {
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
  height: 140px;
}

.user-list {
  width: 100%;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  &__with-friend-list {
    max-height: calc(100vh - 430px);
  }
}

.friend-list {
  max-width: 300px;
  height: 160px;
  position: fixed;
  bottom: 36px;
}

.v-text-field__details {
  display: none;
}
</style>
