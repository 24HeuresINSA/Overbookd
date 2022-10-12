<template>
  <div>
    <v-container
      v-if="!isUserHardOrSoft"
      class="align-stretch flex-wrap align-content-start"
    >
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <UserCard />
        </v-col>

        <v-col cols="12" sm="6" md="8">
          <v-card>
            <v-card-title><h3>Tu n'as pas été validé</h3></v-card-title>
            <v-card-text style="font-size: 1.1em">
              <p>
                Tu n'as pas encore été validé par le magnifique Lucas <br />
                Tu ferais bien de lui donner 1 euros apparement ça aide ...
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else class="align-stretch flex-wrap align-content-start">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <UserCard />
        </v-col>

        <v-col cols="12" sm="6" md="8">
          <UserNotifications />
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <ComptesPersosCard v-if="hasRole('hard')" />
          <FriendsCard v-else />
        </v-col>

        <v-col v-if="isManif()" cols="12" sm="6" md="8">
          <AvailabilitiesCard v-if="isAvailabilityMomennt()" />
          <PlanningCard v-else />
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
import UserCard from "@/components/organisms/userCard.vue";
import UserNotifications from "@/components/organisms/userNotifications.vue";
import SnackNotificationContainer from "@/components/molecules/snackNotificationContainer.vue";
import ComptesPersosCard from "@/components/organisms/comptesPersosCard.vue";
import FriendsCard from "@/components/molecules/friendsCard.vue";
import AvailabilitiesCard from "@/components/organisms/AvailabilitiesCard.vue";
import PlanningCard from "@/components/organisms/PlanningCard.vue";

export default {
  components: {
    UserCard,
    UserNotifications,
    SnackNotificationContainer,
    ComptesPersosCard,
    FriendsCard,
    AvailabilitiesCard,
    PlanningCard,
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
    isUserHardOrSoft() {
      return this.me.team.includes("hard") || this.me.team.includes("soft");
    },
  },
  async mounted() {
    this.$accessor.user.fetchUser();
  },
  methods: {
    hasRole(team) {
      return this.$accessor.user.hasRole(team);
    },

    async logout() {
      await this.$auth.logout();
      await this.$router.push({
        path: "/login",
      });
    },
    isAvailabilityMomennt() {
      return this.$accessor.config.getConfig("availabilityMoment");
    },
    isManif() {
      //TODO: check if manif is active
      return false;
    },
  },
};
</script>
<style></style>
