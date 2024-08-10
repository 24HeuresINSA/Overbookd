<template>
  <v-card class="card">
    <v-btn
      class="card__close-btn"
      variant="flat"
      icon="mdi-close"
      @click="close"
    />
    <v-card-title class="card__title">
      <h2><slot name="title" /></h2>
    </v-card-title>

    <div class="card__subtitle">
      <p><slot name="subtitle" /></p>
    </div>

    <v-card-text class="card__content">
      <slot name="content" />
    </v-card-text>

    <v-card-actions v-if="!withoutActions" class="card__actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
const { withoutActions } = defineProps({
  withoutActions: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.card {
  &__title {
    display: flex;
    justify-content: center;
    padding-bottom: 0 !important;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__subtitle {
    margin: 0 16px 5px 16px;
    p {
      text-align: center;
    }
  }
  &__content {
    padding-top: 5px !important;
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
