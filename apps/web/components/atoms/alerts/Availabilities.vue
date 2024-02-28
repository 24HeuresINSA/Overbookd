<template>
  <v-alert
    :class="alertClass"
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
import { defineComponent } from "vue";
import { AvailabilitesAlert } from "@overbookd/volunteer-availability";

export default defineComponent({
  name: "AvailabilitiesAlert",
  props: {
    alert: {
      type: Object as () => AvailabilitesAlert,
      required: true,
    },
  },
  computed: {
    hasNoAvailabilities(): boolean {
      return this.alert.availabilitiesCount === 0;
    },
    alertClass(): string {
      return this.hasNoAvailabilities
        ? "no-availabilities"
        : "has-availabilities";
    },
    icon(): string {
      return this.hasNoAvailabilities ? "mdi-clock-alert" : "mdi-clock";
    },
    details(): string {
      return this.hasNoAvailabilities
        ? "Sans disponibilités tu ne pourras malheureusement pas faire partie de l'aventure. 😢"
        : "N'hésite pas a compléter tes disponibilités pour augmenter tes chances d'être accepté en tant que bénévole.";
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
