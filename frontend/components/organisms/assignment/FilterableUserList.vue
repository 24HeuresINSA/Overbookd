<template>
  <v-card class="filterable-user-list">
    <v-card-text>
      <div class="filters">
        <SearchUser
          v-model="user"
          class="filters__field"
          :boxed="false"
        ></SearchUser>
        <SearchTeams
          v-model="teams"
          class="filters__field"
          :boxed="false"
        ></SearchTeams>
        <v-btn-toggle v-model="hasLicense" tile group color="primary">
          <v-btn x-small :value="true">Permis</v-btn>
          <v-btn x-small :value="false">Pas de permis</v-btn>
        </v-btn-toggle>
      </div>
      <v-divider></v-divider>
      <div class="user-list">
        <UserList :volunteers="filteredVolunteers" />
        <p>
          Nombre de personnes dans la liste :
          <span class="font-weight-bold">{{ filteredVolunteers.length }}</span>
        </p>
        <FriendsDisplay />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import UserList from "~/components/molecules/users/UserList.vue";
import FriendsDisplay from "~/components/molecules/friends/FriendsDisplay.vue";
import SearchTeams from "~/components/atoms/SearchTeams.vue";
import SearchUser from "~/components/atoms/SearchUser.vue";
import { CompleteUserWithPermissions, User } from "~/utils/models/user";
import { Team } from "~/utils/models/team";
import { Volunteer } from "~/utils/models/assignment";

interface FiltersData {
  teams: Team[];
  user?: CompleteUserWithPermissions;
  hasLicense?: boolean;
}

export default Vue.extend({
  name: "FilterableUserList",
  components: { UserList, FriendsDisplay, SearchTeams, SearchUser },
  data(): FiltersData {
    return {
      teams: [],
      user: undefined,
      hasLicense: undefined,
    };
  },
  computed: {
    filteredVolunteers(): Volunteer[] {
      return this.$accessor.assignment.volunteers.filter((volunteer) => {
        return (
          (this.filterVolunteerByTeamCode("soft")(volunteer) ||
            this.filterVolunteerByTeamCode("hard")(volunteer)) &&
          this.filterVolunteerByUser(this.user)(volunteer) &&
          this.filterVolunteerByTeams(this.teams)(volunteer) &&
          this.filterVolunteerByLicense(this.hasLicense)(volunteer)
        );
      });
    },
  },
  methods: {
    filterVolunteerByTeamCode(
      teamSearchedCode?: string
    ): (volunteer: Volunteer) => boolean {
      return teamSearchedCode
        ? (volunteer) =>
            volunteer.teams.map((team) => team.code).includes(teamSearchedCode)
        : () => true;
    },
    filterVolunteerByTeams(
      teamsSearched: Team[]
    ): (volunteer: Volunteer) => boolean {
      return teamsSearched.length > 0
        ? (volunteer) =>
            volunteer.teams
              .map((team) => team.code)
              .some((code) =>
                teamsSearched.map((team) => team.code).includes(code)
              )
        : () => true;
    },
    filterVolunteerByUser(
      userSearched?: User
    ): (volunteer: Volunteer) => boolean {
      return userSearched
        ? (volunteer) => volunteer.id === userSearched.id
        : () => true;
    },
    filterVolunteerByLicense(
      hasLicense?: boolean
    ): (volunteer: Volunteer) => boolean {
      return hasLicense !== undefined
        ? (volunteer) =>
            (hasLicense &&
              this.filterVolunteerByTeamCode("conducteur")(volunteer)) ||
            (!hasLicense &&
              !this.filterVolunteerByTeamCode("conducteur")(volunteer))
        : () => true;
    },
  },
});
</script>

<style lang="scss" scoped>
.filterable-user-list {
  overflow-y: auto;
}

.filters {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &__field {
    padding-top: 0;
    margin-top: 0;
  }
}

.user-list {
  display: flex;
  flex-direction: column;
}
</style>
