<template>
  <DialogCard @close="close">
    <template #title>Demander de l'aide</template>
    <template #content>
      Si vous avez rencontré un problème lors de l'inscription vous pouvez nous
      envoyer un mail à l'adresse
      <a :href="`mailto:${HUMAINS_EMAIL}`">{{ HUMAINS_EMAIL }}</a
      >.
      <br />
      Nous nous en occuperons au plus vite.
    </template>
    <template #actions>
      <v-btn
        :href="`mailto:${HUMAINS_EMAIL}`"
        text="Envoyer le mail"
        variant="elevated"
        size="large"
        color="primary"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>
