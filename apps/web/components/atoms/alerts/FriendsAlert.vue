<template>
  <v-alert
    icon="mdi-account-heart"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">Tu veux profiter du festival avec tes amis ? 🤩</h2>
    <p class="catch-phrase">
      Tu peux ajouter des amis à tout moment sur
      <nuxt-link to="/profile">ton profil</nuxt-link>.
    </p>
    <p class="details">
      Renseigne tes amis et nous ferons notre maximum pour que tu aies le plus
      de créneaux avec eux ! C'est quand même plus sympa de profiter du festival
      avec ses amis, non ? 😉
    </p>
  </v-alert>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FriendsAlert",
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
