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
      <div class="actions">
        <v-btn
          text="Copier l'adresse mail"
          color="secondary"
          @click="copyEmail"
        />
        <v-btn text="Envoyer un mail" :href="`mailto:${HUMAINS_EMAIL}`" />
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";
import { copyToClipboard } from "~/utils/clipboard";

const emit = defineEmits(["close"]);
const close = () => emit("close");

const copyEmail = () => copyToClipboard(HUMAINS_EMAIL, "Email copié ✅");
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  gap: 10px;

  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}
</style>
