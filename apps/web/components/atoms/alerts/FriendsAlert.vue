<template>
  <v-alert
    icon="mdi-account-heart"
    border="'left'"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">Pas d'amis 😕</h2>
    <p class="catch-phrase">Comment peux-t-on te mettre avec tes amis ?!</p>
    <p class="details">
      Tu peux ajouter des amis à tout moment sur
      <nuxt-link to="/profile">ton profil</nuxt-link>. Si tu nous dis qui sont
      tes amis, nous pourrons faire notre maximum pour que tu aies le plus de
      créneaux avec eux !
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
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
