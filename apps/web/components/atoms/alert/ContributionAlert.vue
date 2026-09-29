<template>
  <v-alert
    icon="mdi-hand-coin"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Cette {{ alert.edition }}ème édition ne peut pas se faire sans toi !
    </p>
    <p class="details">
      La cotisation est nécessaire pour devenir adhérent à l'association. Cette adhésion te permet d'être couvert par l'assurance de l'association pendant les évènements mais aussi d'avoir le droit de votes lors des différentes Assemblées Générales.
    </p>
  </v-alert>
</template>

<script lang="ts" setup>
import Vue from "vue";
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
  padding-right: 30px;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
