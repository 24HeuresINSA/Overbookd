<template>
  <v-alert
    dark
    icon="mdi-hand-coin"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Cette {{ edition }}eme edition ne peut se faire sans toi !
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
  "La cotisation est necessaire pour devenir adherent a l'association. Cette adhesion te permet d'etre couvert par l'assurance de l'association pendant les evenements mais aussi d'avoir le droit de votes aux differentes Assemblees Generales";

export default Vue.extend({
  name: "ContributionAlert",
  props: {
    alert: {
      type: SettleAlert,
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
