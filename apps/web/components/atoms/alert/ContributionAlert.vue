<template>
  <v-alert
    icon="mdi-hand-coin"
    color="secondary"
    variant="elevated"
    border="start"
    prominent
    closable
    class="px-16"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Cette {{ alert.edition }}ème édition ne peut pas se faire sans toi !
    </p>
    <p class="details">
      La cotisation est nécessaire pour devenir adhérent à l'association. Cette
      adhésion te permet d'être couvert par l'assurance de l'association pendant
      les évènements mais aussi d'avoir le droit de votes lors des différentes
      Assemblées Générales.
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
import { SettleAlert } from "@overbookd/contribution";

const { alert } = defineProps({
  alert: {
    type: Object as PropType<SettleAlert>,
    required: true,
  },
});

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
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
