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

        <v-col v-if="hasRole('hard')" cols="12" sm="6" lg="4">
          <ComptesPersosCard />
        </v-col>

        <v-col cols="12" sm="6" lg="4">
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
          Merci de rejoindre l'asso mais ton compte n'est pas encore activer...
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="logout">DECO</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- <v-dialog v-model="isPPDialogOpen" max-width="600">
      <v-card>
        <v-card-text>
          <v-file-input v-model="PP"> </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="uploadPP()">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
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
import { getKeycloakID } from "~/middleware/user";
import { mapState } from "vuex";

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
    // map user store state to user var
    ...mapState("user", {
      user: (state) => state.me,
    }),
    hasNotBeenApproved() {
      // user is not or could not be loaded from the store
      if (!this.user) {
        return true;
      }
      // user has no team
      if (this.user.team === undefined || this.user.team.length === 0) {
        return true;
      }
      return false;
    },
  },
  async mounted() {
    //TODO Better way ?
    this.$store.dispatch("user/fetchUser", getKeycloakID(this));

    //TODO: change to repo
    this.usernames = (await this.$axios.get("/user/all")).data;
    this.notValidatedCount = await this.getNotValidatedCount();
  },
  methods: {
    async getNotValidatedCount() {
      //TODO: change to repo
      let { data: users } = await this.$axios.get("/user");
      return users.filter((user) => user.team.length === 0).length;
    },

    hasRole(team) {
      return hasRole(this, team);
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
