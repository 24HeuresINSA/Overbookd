<template>
  <v-alert
    icon="mdi-account-heart"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">Profite du festival avec tes amis ! 🤩</h2>
    <p class="catch-phrase">
      C'est quand même plus sympa
      <nuxt-link to="/profile#friends">avec ses amis</nuxt-link> non ? 😉
    </p>
    <p class="details">
      Renseigne tes amis et nous ferons notre maximum pour que tu aies le plus
      de créneaux avec eux !
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
