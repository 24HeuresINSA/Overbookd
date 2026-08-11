<template>
  <ConfirmationDialogCard
    confirm-color="error"
    @close="close"
    @confirm="confirm"
  >
    <template #title>Anonymisation de l'utilisateur</template>
    <template #content>
      <p>
        Cet utilisateur a des transactions enregistrées avec son CP. Le compte
        ne sera donc pas supprimé mais anonymisé.
      </p>
      <p>
        Es-tu sûr de vouloir
        <strong>DEFINITIVEMENT anonymiser cet utilisateur d'Overbookd</strong> ?
        Cette action est IRREVERSIBLE et supprimera toutes les données de
        l'utilisateur sauf ses transactions.
      </p>
      <p>
        L'utilisateur ne pourra pas récupérer son compte et devra recréer un
        compte de zéro pour pouvoir utiliser à nouveau Overbookd.
      </p>
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close", "confirm"]);
const close = () => emit("close");
const confirm = () => emit("confirm");
</script>
