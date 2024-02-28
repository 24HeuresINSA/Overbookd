<template>
  <v-alert
    :color="color"
    :icon="icon"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Tu peux ajouter des créneaux sur
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
    icon(): string {
      return this.hasNoAvailabilities ? "mdi-clock-alert" : "mdi-clock";
    },
    details(): string {
      return this.hasNoAvailabilities
        ? "Sans disponibilitéss tu ne pourras malheureusement pas faire partie de l'aventure. 😢"
        : `Tu est actuellement disponible sur ${this.alert.nbPeriods} créneaux. Plus tu as de charisme (donc de dispos) et plus tu auras de chance d'être pris. 😉`;
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
.info a {
  color: $yellow-24h;
}

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
