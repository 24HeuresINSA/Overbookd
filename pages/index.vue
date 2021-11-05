<template>
  <div>
    <v-container class="align-stretch flex-wrap align-content-start">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <UserCard />
        </v-col>

        <v-col cols="12" sm="6" md="8">
          <UserNotifications />
        </v-col>

        <v-col v-if="hasRole('hard')" cols="12" sm="6" lg="8">
          <ComptesPersosCard />
        </v-col>

        <v-col v-if="hasRole('soft')" cols="12" sm="6" lg="4">
          <FriendsCard />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
          <ClickerCard />
        </v-col>
      </v-row>
    </v-container>

    <SnackNotificationContainer />

    <v-dialog v-model="hasNotBeenApproved" max-width="600" persistent>
      <v-card>
        <v-card-title>Oupsss</v-card-title>
        <v-card-text>
          Merci de rejoindre l'asso mais il faut qu'un admin active ton compte
          (demande à Maëlle)..
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="logout">DÉCONNEXION</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";
import UserCard from "@/components/organisms/userCard.vue";
import UserNotifications from "@/components/organisms/userNotifications.vue";
import SnackNotificationContainer from "@/components/molecules/snackNotificationContainer.vue";
import ComptesPersosCard from "@/components/organisms/comptesPersosCard.vue";
import FriendsCard from "@/components/molecules/friendsCard.vue";
import ClickerCard from "@/components/molecules/clickerCard.vue";
import { getUserID } from "~/middleware/user";
import { mapState } from "vuex";
import { dispatch } from "~/utils/store";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

export default {
  components: {
    UserCard,
    UserNotifications,
    SnackNotificationContainer,
    ComptesPersosCard,
    FriendsCard,
    ClickerCard,
  },

  data() {
    return {};
  },

  computed: {
    me() {
      return this.$accessor.user.me;
    },
    hasNotBeenApproved() {
      // user is not or could not be loaded from the store
      if (!this.me) {
        return false; // not loaded yet
      }
      // user has no team
      return this.me.team === undefined || this.me.team.length === 0;
    },
  },
  async mounted() {
    dispatch(this, "user", "fetchUser", getUserID(this));

    this.notValidatedCount = this.getNotValidatedCount();
  },
  methods: {
    async getNotValidatedCount() {
      //TODO: change to repo
      if (this.hasRole("admin")) {
        let { data: users } = await this.$axios.get("/user");
        return users.filter((user) => user.team.length === 0).length;
      }
      return 0;
    },

    hasRole(team) {
      if (this.me.team) {
        return this.me.team.includes(team);
      }
      return false;
    },

    async logout() {
      await this.$auth.logout();
      await this.$router.push({
        path: "/login",
      });
    },
  },
};
</script>
<style></style>
