<template>
  <DialogCard @close="close">
    <template #title>Demander de l'aide</template>
    <template #content>
      <p>
        Si tu as un problème ou que tu te poses une question, contacte par mail
        les responsables bénévoles à l'adresse <code>{{ HUMAINS_EMAIL }}</code>
        <br />
        Nous nous en occuperons au plus vite.
      </p>
    </template>
    <template #actions>
      <v-btn
        text="Copier l'adresse mail"
        variant="elevated"
        color="secondary"
        @click="copyEmail"
      />
      <v-btn
        text="Envoyer un mail"
        variant="elevated"
        color="primary"
        :href="`mailto:${HUMAINS_EMAIL}`"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const emit = defineEmits(["close"]);
const close = () => emit("close");

const copyEmail = async () => {
  await navigator.clipboard.writeText(HUMAINS_EMAIL);
  sendSuccessNotification("Email copié ✅");
};
</script>
