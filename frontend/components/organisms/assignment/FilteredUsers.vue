<template>
  <div>
    <!-- list of  filtered users -->
    <v-card>
      <v-card-text>
        <div class="filters">
          <SearchUser class="pt-0 mt-0" :boxed="false"></SearchUser>
          <SearchTeams class="pt-0 mt-0" :boxed="false"></SearchTeams>
          <v-btn-toggle tile group color="primary">
            <v-btn x-small :value="true">Permis</v-btn>
            <v-btn x-small :value="false">Pas de permis</v-btn>
          </v-btn-toggle>
        </div>
        <v-divider></v-divider>
        <div class="content">
          <UsersList :users="filteredUsers" />
          <p>
            Nombre de personnes dans la liste :
            <span class="font-weight-bold">{{ filteredUsers.length }}</span>
          </p>
          <FriendsDisplay v-if="isModeOrgaToTask" />
          <v-switch
            v-if="!isModeOrgaToTask"
            label="Bypass les roles (TACHE-ORGA ONLY)"
            @change="toggleBypass()"
          ></v-switch>
          <!-- <v-switch
            label="Afficher users en cours de validation (ORGA-TACHE)"
            @change="toggleShowToValidate()"
          ></v-switch> -->
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import UsersList from "~/components/molecules/users/UsersList.vue";
import FriendsDisplay from "~/components/molecules/friends/FriendsDisplay.vue";
import SearchTeams from "~/components/atoms/SearchTeams.vue";
import SearchUser from "~/components/atoms/SearchUser.vue";

export default Vue.extend({
  name: "FilteredUsers",
  components: { UsersList, FriendsDisplay, SearchTeams, SearchUser },
  props: {
    assignmentMode: {
      type: String,
      default: "orga-task",
    },
  },

  data() {
    return {
      teams: this.$accessor.team.allTeams,
    };
  },

  computed: {
    filteredUsers(): any[] {
      const showToValidate =
        this.$accessor.assignment.filters.user.showToValidate;
      return this.$accessor.assignment.filteredUsers.filter(
        (user) =>
          showToValidate ||
          user.team.includes("hard") ||
          user.team.includes("soft")
      );
    },
    isModeOrgaToTask(): boolean {
      return this.assignmentMode === "orga-task";
    },
  },

  methods: {
    toggleBypass() {
      this.$accessor.assignment.toggleBypass();
    },
    toggleShowToValidate() {
      this.$accessor.assignment.toggleShowToValidate();
    },
  },
});
</script>

<style scoped lang="scss">
.filters {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
}
</style>
