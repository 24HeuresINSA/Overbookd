<template>
  <v-alert
    icon="mdi-incognito"
    color="secondary"
    variant="elevated"
    border="start"
    density="comfortable"
    prominent
    closable
  >
    <h2 class="summary">Tu n'as pas de photo de profil 🥷</h2>
    <p class="catch-phrase">C'est pas très pratique pour te reconnaître.</p>
    <p class="desktop-only">
      Pour en ajouter une, tu peux cliquer sur le petit crayon à droite de ton
      profil.
    </p>

    <template #close>
      <v-btn
        icon="mdi-close"
        size="x-large"
        density="compact"
        @click="dismiss"
      />
    </template>
  </v-alert>
</template>

<script lang="ts" setup>
const emit = defineEmits(["dismiss"]);
const dismiss = () => emit("dismiss");
</script>

<style lang="scss" scoped>
.summary {
  @media only screen and (max-width: $mobile-max-width) {
    font-size: large;
  }
}
</style>
