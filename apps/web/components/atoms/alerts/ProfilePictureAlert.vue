<template>
  <v-alert
    icon="mdi-incognito"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">Pas de photo de profil 🥷</h2>
    <p class="catch-phrase">Comment veux-tu qu'on te reconnaisse ?!</p>
    <p class="details">
      Tu peux mettre à jour ta photo à tout moment sur
      <nuxt-link to="/profile">ton profil</nuxt-link>. Avec une photo, il est
      plus facile de se retrouver pendant le festival mais aussi à n'importe
      quel évènement de l'asso.
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ProfilePictureAlert",
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
