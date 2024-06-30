<template>
  <div class="comment-field">
    <p class="comment-field__prepend-text">
      Dis nous en commentaire si tu as des contraintes physiques, de la
      motivation à revendre pour nous aider un maximum ou encore un préféré
      parmi les responsables bénévoles 😏
    </p>
    <v-textarea
      v-model="comment"
      class="comment-field__input"
      label="Commentaire"
      hint="Exemple: Je ne peux pas porter de charges lourdes mais j'adore m'occuper des animations pour enfants. La musique c'est pas trop mon délire donc je suis chaud de faire plein de trucs pour m'éviter les concerts."
      persistent-hint
    />
  </div>
</template>

<script lang="ts" setup>
const comment = defineModel<string>({ required: true });
</script>

<style lang="scss" scoped>
.comment-field {
  &__prepend-text {
    color: rgb(115, 115, 115);
  }
  &__input {
    margin-top: 5px;
  }
}
</style>
