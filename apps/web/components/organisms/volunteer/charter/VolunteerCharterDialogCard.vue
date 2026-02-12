<template>
  <v-card rounded="0" class="mx-0 my-0 px-0 py-0">
    <v-toolbar color="background">
      <v-btn
        icon="mdi-close"
        aria-label="Fermer"
        title="Fermer"
        @click="close"
      />
      <v-toolbar-title>Charte Bénévole</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <VolunteerCharter @signed="signed" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close", "signed"]);
const close = () => emit("close");
const signed = () => emit("signed")
</script>
