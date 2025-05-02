<template>
  <v-card :theme="theme" class="card">
    <v-btn
      v-show="!noClosable"
      class="card__close-btn"
      variant="flat"
      icon="mdi-close"
      density="compact"
      @click="close"
    />
    <v-card-title class="card__title">
      <h2><slot name="title" /></h2>
    </v-card-title>

    <div class="card__subtitle">
      <p><slot name="subtitle" /></p>
    </div>

    <v-card-text class="card__content" :class="{ 'mb-3': withoutActions }">
      <slot name="content" />
    </v-card-text>

    <v-card-actions v-if="!withoutActions" class="card__actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
const { noClosable } = defineProps({
  theme: {
    type: String,
    default: undefined,
  },
  withoutActions: {
    type: Boolean,
    default: false,
  },
  noClosable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "enter"]);

const close = () => {
  if (noClosable) return;
  emit("close");
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") emit("enter");
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  &__title {
    display: flex;
    justify-content: center;
    padding-bottom: 0 !important;
    margin: 0 15px;
    h2 {
      flex: 1;
      text-align: center;
      white-space: normal;
      word-wrap: break-word;
      word-break: break-word;
      @media screen and (max-width: $mobile-max-width) {
        font-size: 1.4rem;
      }
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
    top: 8px;
    right: 8px;
  }
}
</style>
