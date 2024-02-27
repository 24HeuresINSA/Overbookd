<template>
  <v-alert
    :color="color"
    icon="mdi-clock"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Tu peux en ajouter sur
      <nuxt-link to="/availabilities">mes disponibilités</nuxt-link>.
    </p>
    <p class="details">
      {{ details }}
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { AvailabilitesAlert } from "@overbookd/volunteer-availability";

export default Vue.extend({
  name: "AvailabilitiesAlert",
  props: {
    alert: {
      type: Object as () => AvailabilitesAlert,
      required: true,
    },
  },
  computed: {
    hasNoAvailabilities(): boolean {
      return this.alert.nbPeriods === 0;
    },
    color(): string {
      return this.hasNoAvailabilities ? "error" : "info";
    },
    details(): string {
      return this.hasNoAvailabilities
        ? "Sans dispos tu ne pourras pas faire partie de l'aventure."
        : `${this.alert.nbPeriods}`;
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
