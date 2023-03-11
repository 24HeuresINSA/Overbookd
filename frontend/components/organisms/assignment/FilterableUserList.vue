<template>
  <v-card>
    <v-card-text>
      <div class="filters">
        <SearchUser class="filters__field" :boxed="false"></SearchUser>
        <SearchTeams class="filters__field" :boxed="false"></SearchTeams>
        <v-btn-toggle tile group color="primary">
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

export default Vue.extend({
  name: "FilterableUserList",
  components: { UserList, FriendsDisplay, SearchTeams, SearchUser },
  computed: {
    filteredUsers(): CompleteUserWithPermissions[] {
      return this.$accessor.user.users.filter(
        (user) => user.team.includes("hard") || user.team.includes("soft")
      );
    },
  },
});
</script>

<style lang="scss" scoped>
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
