<template>
  <v-alert
    color="error"
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
      Sans dispos tu ne pourras pas faire partie de l'aventure.
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
