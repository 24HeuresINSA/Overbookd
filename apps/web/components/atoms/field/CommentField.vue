<template>
  <div>
    <div class="comment-title">
      <span>Commentaire</span>
      <v-tooltip location="top">
        <template #activator="{ props }">
          <v-icon v-bind="props" color="primary">mdi-information</v-icon>
        </template>
        Dis nous en commentaire si tu as des contraintes physiques, de la
        motivation à revendre pour nous aider un maximum ou encore un préféré
        parmi les responsables bénévoles 😏
      </v-tooltip>
    </div>
    <v-textarea
      v-model="comment"
      rows="4"
      hint="Exemple: Je ne peux pas porter de charges lourdes mais j'adore m'occuper des animations pour enfants."
      persistent-hint
    />
  </div>
</template>

<script lang="ts" setup>
const comment = defineModel<string | null | undefined>({ required: true });
</script>

<style lang="scss" scoped>
.comment-title {
  display: flex;
  gap: 2px;
  align-items: center;
}
</style>
