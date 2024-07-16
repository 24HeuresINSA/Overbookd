<template>
  <v-card>
    <v-card-title class="title">
      Conditions Générales d'Utilisation
    </v-card-title>
    <v-card-text>
      Salut, si tu vois ce message, c'est que les CGU d'Overbookd ont été mises
      à jour ! Pour continuer à utiliser ton site préféré, tu dois les accepter.
      <br />
      Consulte les en cliquant juste
      <span class="gcu-link" @click="openEULADialog">ICI</span>.
      <br />
      Approuver les CGU signifie que tu reconnais les avoir lues, comprises et
      acceptées.
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn
        text="Se déconnecter"
        color="error"
        variant="elevated"
        @click="logout"
      />
      <v-btn
        text="Approuver les CGU"
        color="success"
        variant="elevated"
        @click="approveEndUserLicenceAgreement"
      />
    </v-card-actions>
  </v-card>

  <v-dialog
    v-model="isEULADialogOpen"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <EULADialogCard @close="closeEULADialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();

const isEULADialogOpen = ref(false);
const openEULADialog = () => (isEULADialogOpen.value = true);
const closeEULADialog = () => (isEULADialogOpen.value = false);

const approveEndUserLicenceAgreement = async () => {
  await userStore.approveEndUserLicenceAgreement();
};
const logout = async () => {
  authStore.logout();
  await router.push({ path: "/login" });
  userStore.clearLoggedUser();
};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}

.eula-link {
  color: blue;
  cursor: pointer;
  text-decoration: underline;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3%;
  .v-btn {
    flex-grow: 1;
  }
  @media only screen and (max-width: $mobile-max-width) {
    gap: 5px;
    flex-direction: column-reverse;
  }
}
</style>
