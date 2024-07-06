<template>
  <v-card>
    <v-card-title>Demander de l'aide</v-card-title>
    <v-card-text>
      <h5>
        Si tu as un problème ou que tu te poses une question, contacte par mail
        les responsables bénévoles à l'adresse <code>{{ HUMAINS_EMAIL }}</code>
        <br />
        Nous nous en occuperons au plus vite.
      </h5>
    </v-card-text>
    <v-card-actions id="actions">
      <v-btn id="copy-email-button" variant="elevated" @click="copyEmail">
        Copier l'adresse mail
      </v-btn>
      <v-btn
        id="send-email-button"
        variant="elevated"
        :href="`mailto:${HUMAINS_EMAIL}`"
      >
        Envoyer un mail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const copyEmail = async () => {
  await navigator.clipboard.writeText(HUMAINS_EMAIL);
  sendSuccessNotification("Email copié ✅");
};
</script>

<style scoped lang="scss">
#actions {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  align-items: center;
  justify-content: center;

  #copy-email-button {
    background-color: orange;
  }

  #send-email-button {
    background-color: deepskyblue;
  }
}
</style>
