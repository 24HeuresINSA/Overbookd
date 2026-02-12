<template>
  <DialogCard no-closable>
    <template #title> Charte Bénévole </template>
    <template #content>
      Salut, si tu vois ce message, c'est que tu n'as pas encore signé la Charte
      Bénévole 😱 Pour pouvoir être bénévole, tu dois la signer de ce pas !
      <br />
      Si cela ne te convient pas, contacte les responsables bénévoles au plus
      vite à ce mail
      <a :href="`mailto:${HUMAINS_EMAIL}`"> {{ HUMAINS_EMAIL }} </a>.
    </template>
    <template #actions>
      <div class="actions">
        <v-btn text="Se déconnecter" color="error" @click="logout" />
        <v-btn
          text="Lire et signer la Charte"
          color="success"
          @click="openCharterDialog"
        />
      </div>
    </template>
  </DialogCard>

  <v-dialog
    v-model="isCharterDialogOpen"
    transition="dialog-bottom-transition"
    fullscreen
  >
    <VolunteerCharterDialogCard
      @close="closeCharterDialog"
      @signed="closeCharterDialog"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import { LOGIN_URL } from "@overbookd/web-page";
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const userStore = useUserStore();
const authStore = useAuthStore();

const isCharterDialogOpen = ref<boolean>(false);
const openCharterDialog = () => (isCharterDialogOpen.value = true);
const closeCharterDialog = () => (isCharterDialogOpen.value = false);

const logout = async () => {
  authStore.logout();
  await navigateTo(LOGIN_URL);
  userStore.clearLoggedUser();
};
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column-reverse;
  }
}
</style>
