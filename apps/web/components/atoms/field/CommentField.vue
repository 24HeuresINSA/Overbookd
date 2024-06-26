<template>
  <v-textarea
    v-model="comment"
    class="comment-input"
    label="Commentaire"
    hint="Exemple: Je ne peux pas porter de charges lourdes mais j'adore m'occuper des animations pour enfants. La musique c'est pas trop mon délire donc je suis chaud de faire plein de trucs pour m'éviter les concerts."
    persistent-hint
  >
    <template #prepend>
      <p class="prepend-text">
        Dis nous en commentaire si tu as des contraintes physiques, de la
        motivation à revendre pour nous aider un maximum ou encore un préféré
        parmi les responsables bénévoles 😏
      </p>
    </template>
  </v-textarea>
</template>

<script lang="ts" setup>
const comment = defineModel<string>({ required: true });
</script>

<style lang="scss" scoped>
.comment-input {
  flex-direction: column;
  gap: 7px;
}

.prepend-text {
  color: rgb(77, 77, 77);
}
</style>
