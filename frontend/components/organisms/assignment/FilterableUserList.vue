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
        <UserList :users="filteredUsers" />
        <p>
          Nombre de personnes dans la liste :
          <span class="font-weight-bold">{{ filteredUsers.length }}</span>
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
import { CompleteUserWithPermissions } from "~/utils/models/user";
import { Team } from "~/utils/models/team";

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
    filteredUsers(): CompleteUserWithPermissions[] {
      let filteredUsers = this.$accessor.user.users;

      // Keep users with hard or soft teams
      filteredUsers = filteredUsers.filter(
        (user) => user.team.includes("hard") || user.team.includes("soft")
      );

      // Keep users with the selected teams
      if (this.teams.length > 0) {
        filteredUsers = filteredUsers.filter((user) =>
          this.teams.some((team) => user.team.includes(team.code))
        );
      }

      // Keep users with the selected user
      if (this.user) {
        filteredUsers = filteredUsers.filter(
          (user) => user.id === (this.user as CompleteUserWithPermissions).id
        );
      }

      // Keep users with or without license
      if (this.hasLicense !== undefined) {
        filteredUsers = filteredUsers.filter(
          (user) =>
            (this.hasLicense && user.team.includes("conducteur")) ||
            (!this.hasLicense && !user.team.includes("conducteur"))
        );
      }

      return filteredUsers;
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
