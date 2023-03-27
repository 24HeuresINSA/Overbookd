<template>
  <v-card class="filterable-user-list">
    <v-card-text>
      <div class="filters">
        <v-text-field
          v-model="volunteer"
          class="filters__field"
          label="Recherche"
        ></v-text-field>
        <SearchTeams
          v-model="teams"
          class="filters__field"
          :boxed="false"
        ></SearchTeams>
        <p>
          Nombre de personnes dans la liste :
          <span class="font-weight-bold">{{ filteredVolunteers.length }}</span>
        </p>
      </div>
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
import SearchTeams from "~/components/atoms/SearchTeams.vue";
import { Team } from "~/utils/models/team";
import { Volunteer, AssignmentModes } from "~/utils/models/assignment";

interface FiltersData {
  teams: Team[];
  volunteer: string;
}

export default Vue.extend({
  name: "FilterableUserList",
  components: { UserList, FriendsDisplay, SearchTeams },
  data(): FiltersData {
    return {
      teams: [],
      volunteer: "",
    };
  },
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  padding: 0 1rem;

  &__field {
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
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
