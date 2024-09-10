<template>
  <DialogCard no-closable>
    <template #title> Conditions Générales d'Utilisation </template>
    <template #content>
      Salut, si tu vois ce message, c'est que les CGU d'Overbookd ont été mises
      à jour ! Pour continuer à utiliser ton site préféré, tu dois les accepter.
      <br />
      Consulte les en cliquant juste
      <span class="eula-link" @click="openEULADialog">ICI</span>.
      <br />
      Approuver les CGU signifie que tu reconnais les avoir lues, comprises et
      acceptées.
    </template>
    <template #actions>
      <div class="actions">
        <v-btn text="Se déconnecter" color="error" @click="logout" />
        <v-btn
          text="Approuver les CGU"
          color="success"
          @click="approveEndUserLicenceAgreement"
        />
      </div>
    </template>
  </DialogCard>

  <v-dialog
    v-model="isEULADialogOpen"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <EULADialogCard @close="closeEULADialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { LOGIN_URL } from "@overbookd/web-page";

const userStore = useUserStore();
const authStore = useAuthStore();

const isEULADialogOpen = ref<boolean>(false);
const openEULADialog = () => (isEULADialogOpen.value = true);
const closeEULADialog = () => (isEULADialogOpen.value = false);

const approveEndUserLicenceAgreement = async () => {
  await userStore.approveEndUserLicenceAgreement();
};
const logout = async () => {
  authStore.logout();
  await navigateTo(LOGIN_URL);
  userStore.clearLoggedUser();
};
</script>

<style lang="scss" scoped>
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
  gap: 10px;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column-reverse;
  }
}
</style>
