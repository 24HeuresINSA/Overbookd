<template>
  <v-alert
    icon="mdi-incognito"
    border="start"
    density="compact"
    prominent
    closable
    @click:close="dismiss"
  >
    <h2 class="summary">Tu n'as pas de photo de profil 🥷</h2>
    <p class="details">
      C'est pas très pratique pour te reconnaître. Pour en ajouter une, tu peux
      cliquer sur le petit crayon de ton profil.
    </p>
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

.details {
  padding-right: 30px;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
