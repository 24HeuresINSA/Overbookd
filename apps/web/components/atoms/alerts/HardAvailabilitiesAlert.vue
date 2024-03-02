<template>
  <v-alert
    icon="mdi-clock-alert"
    color="error"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">Tu n'as pas encore renseigné tes disponibilités 😠</h2>
    <p class="catch-phrase">
      Tu peux les ajouter sur
      <nuxt-link to="/availabilities">mes disponibilités</nuxt-link> !
    </p>
    <p class="details">
      Il est impératif de mettre le plus de dispos possibles. Tu peux même te
      faire excuser de cours pour certains TD et CM !
    </p>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HardAvailabilitiesAlert",
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
