<template>
  <v-alert
    icon="mdi-clock"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">
      Tu n'as pas encore été validé par les responsables bénévoles
    </h2>
    <p class="catch-phrase">
      N'hésite pas à rajouter
      <nuxt-link to="/availabilities">des disponibilités</nuxt-link> pour
      augmenter tes chances !
    </p>
    <p class="details">
      Plus on met de disponibilités et plus il est facile pour les responsables
      bénévoles de faire un planning agréable pour tout le monde.
    </p>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RegistreeAvailabilitiesAlert",
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
