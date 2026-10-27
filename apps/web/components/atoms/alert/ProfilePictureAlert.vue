<template>
  <v-alert
    icon="mdi-incognito"
    color="secondary"
    variant="elevated"
    border="start"
    prominent
    closable
  >
    <h2 class="summary">Tu n'as pas de photo de profil 🥷</h2>
    <p class="desktop-only">
      C'est pas très pratique pour te reconnaître. Pour en ajouter une, tu peux
      cliquer sur le petit crayon de ton profil.
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
