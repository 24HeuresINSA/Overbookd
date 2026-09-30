<template>
  <ConfirmationDialogCard
    confirm-color="error"
    @close="close"
    @confirm="confirm"
  >
    <template #title>Suppression de l'utilisateur</template>
    <template #content>
      <div class="content">
        <p>
          Es-tu sûr de vouloir
          <strong>DEFINITIVEMENT supprimer cet utilisateur d'Overbookd</strong>
          ? Cette action est IRREVERSIBLE et supprimera toutes les données de
          l'utilisateur.
        </p>
        <p>
          L'utilisateur devra recréer un compte de zéro pour pouvoir utiliser à
          nouveau Overbookd.
        </p>
      </div>
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close", "confirm"]);
const close = () => emit("close");
const confirm = () => emit("confirm");
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
