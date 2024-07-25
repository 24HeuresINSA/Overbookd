<template>
  <ConfirmationDialogCard
    confirm-color="success"
    @close="close"
    @confirm="confirm"
  >
    <template #title>Réinitialiation des validations</template>
    <template #statement>
      Attention ! Modifier les instructions
      <strong>réinitialisera les validations déjà effectuées</strong>. Es-tu sûr
      de vouloir continuer ?
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-plus-circle-outline </v-icon>Continuer
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["confirm", "close"]);
const close = () => emit("close");
const confirm = () => {
  emit("confirm");
  close();
};
</script>
