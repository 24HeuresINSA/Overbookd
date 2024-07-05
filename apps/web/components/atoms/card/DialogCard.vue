<template>
  <v-card class="card">
    <v-btn
      class="card__close-btn"
      variant="flat"
      icon="mdi-close"
      rounded="0"
      @click="close"
    />
    <v-card-title class="card__title">
      <h2><slot name="title" /></h2>
    </v-card-title>

    <v-card-subtitle class="card__subtitle">
      <slot name="subtitle" />
    </v-card-subtitle>

    <v-card-text class="card__content">
      <slot name="content" />
    </v-card-text>

    <v-card-actions class="card__actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.card {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__subtitle {
    display: flex;
    justify-content: center;
  }
  &__content {
    padding-bottom: 5px !important;
  }
  &__actions {
    display: flex;
    justify-content: center !important;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
