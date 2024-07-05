<template>
  <DialogCard @close="close">
    <template #title>Demander de l'aide</template>
    <template #content>
      Si vous avez rencontré un problème lors de l'inscription vous pouvez nous
      envoyer un mail à l'adresse
      <a href="mailto:humain@24heures.org">humains@24heures.org</a>.
      <br />
      Nous nous en occuperons au plus vite.
    </template>
    <template #actions>
      <v-btn
        href="mailto:humain@24heures.org"
        text="Envoyer le mail"
        variant="elevated"
        size="large"
        color="primary"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>
