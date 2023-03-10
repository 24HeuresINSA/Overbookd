<template>
  <div>
    <v-container class="align-stretch flex-wrap align-content-start">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <UserCard />
        </v-col>

        <v-col v-if="hasPermission('validated-user')" cols="12" sm="6" md="8">
          <UserNotifications />
        </v-col>

        <v-col v-else cols="12" sm="6" md="8">
          <v-card>
            <v-card-title><h3>Tu n'as pas été validé</h3></v-card-title>
            <v-card-text style="font-size: 1.1em">
              <p>
                Tu n'as pas encore été validé par les responsables bénévoles
                <br />
                N'hésite pas
                <strong> a compléter tes disponibilités </strong> pour augmenter
                tes chances.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" class="cta" to="/availabilities">
                rajouter des disponibilités
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <FriendsCard />
        </v-col>
        <v-col v-if="hasPermission('cp')" cols="12" sm="6" md="8">
          <ComptesPersosCard />
        </v-col>
      </v-row>
    </v-container>

    <SnackNotificationContainer />
    <!-- On commente cette partie pour le moment pour que les personnes sans role puissent accéder a leur dispo
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
    -->
  </div>
</template>

<script>
import UserCard from "~/components/organisms/UserCard.vue";
import UserNotifications from "~/components/organisms/UserNotifications.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import ComptesPersosCard from "~/components/organisms/ComptesPersosCard.vue";
import FriendsCard from "~/components/molecules/friends/FriendsCard.vue";

export default {
  components: {
    UserCard,
    UserNotifications,
    SnackNotificationContainer,
    ComptesPersosCard,
    FriendsCard,
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
    this.$accessor.user.fetchUser();
  },
  methods: {
    hasPermission(permission) {
      return this.$accessor.user.hasPermission(permission);
    },

    async logout() {
      await this.$auth.logout();
      await this.$router.push({
        path: "/login",
      });
    },
    isAvailabilityUpdateActive() {
      return true;
    },
    isManif() {
      return true;
    },
  },
};
</script>
<style lang="scss" scoped>
.cta {
  color: white;
}
</style>
