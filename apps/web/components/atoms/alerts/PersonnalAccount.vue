<template>
  <v-alert
    color="error"
    dark
    icon="mdi-nuke"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Tu es à <strong>{{ alert.balance }} €</strong> et c'est déconné !
    </p>
    <p class="details">
      Les comptes persos ne peuvent exister que si tout le monde joue le jeu en
      restant dans le positif. Sinon ça veut dire que: Pas d'argent >> Pas de
      fûts >> Pas de rôtisserie >> Pas de manif >> Pas de manif.
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonnalAccountAlert } from "@overbookd/personnal-account";

export default Vue.extend({
  name: "PersonnalAccountAlert",
  props: {
    alert: {
      type: Object as () => PersonnalAccountAlert,
      required: true,
    },
  },
  methods: {
    dismiss(): void {
      this.$emit("dismiss", this.alert.summary);
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
