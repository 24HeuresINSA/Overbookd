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
      Cette {{ edition }}ème édition ne peut se faire sans toi !
    </p>
    <p class="details">
      {{ details }}
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { SettleAlert } from "@overbookd/contribution";

const ADHESION_FEATURES =
  "La cotisation est nécessaire pour devenir adhérent à l'association. Cette adhésion te permet d'être couvert par l'assurance de l'association pendant les évènements mais aussi d'avoir le droit de votes lors des différentes Assemblées Générales";

export default Vue.extend({
  name: "ContributionAlert",
  props: {
    alert: {
      type: Object as () => SettleAlert,
      required: true,
    },
  },
  computed: {
    edition(): number {
      return this.alert.edition;
    },
    details(): string {
      return ADHESION_FEATURES;
    },
  },
  methods: {
    dismiss(): void {
      this.$emit("dismiss");
    },
  },
});
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
