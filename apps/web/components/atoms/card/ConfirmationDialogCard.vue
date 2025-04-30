<template>
  <v-card class="confirmation">
    <v-btn class="close-btn" variant="flat" icon="mdi-close" @click="close" />
    <v-card-title class="confirmation__title">
      <h2>
        <slot name="title">Confirmation</slot>
      </h2>
    </v-card-title>
    <v-card-text>
      <p class="confirmation__statement">
        <slot name="statement">Vous êtes sur le point de confirmer</slot>
      </p>
    </v-card-text>
    <v-card-actions class="btn-group">
      <v-btn :color="abortColor" size="large" @click="close">
        <slot name="abort-btn-content">
          <v-icon left>mdi-close-circle-outline</v-icon>
          Annuler
        </slot>
      </v-btn>
      <v-btn :color="confirmColor" size="large" @click="confirm">
        <slot name="confirm-btn-content">
          <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
          Confirmer
        </slot>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
defineProps({
  confirmColor: {
    type: String,
    default: "success",
  },
  abortColor: {
    type: String,
    default: "warning",
  },
});

const emit = defineEmits(["confirm", "close"]);

const close = () => emit("close");
const confirm = () => emit("confirm");

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Enter") confirm();
  if (e.key === "Escape") close();
};

onMounted(() => window.addEventListener("keydown", handleKeydown));
onUnmounted(() => window.removeEventListener("keydown", handleKeydown));
</script>

<style lang="scss" scoped>
.confirmation {
  &__title {
    display: flex;
    justify-content: center;

    h2 {
      flex: 1;
      text-align: center;
    }
  }

  &__statement {
    font-size: 1rem;
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }

  .btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3%;

    .v-btn {
      flex-grow: 1;
    }
  }
}
</style>
