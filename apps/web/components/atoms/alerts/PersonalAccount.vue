<template>
  <v-alert
    :color="color"
    dark
    :icon="icon"
    border="left"
    prominent
    dismissible
    @input="dismiss"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="catch-phrase">
      Tu es à <strong>{{ balance }}</strong>, {{ statement }} !
    </p>
    <p class="details">
      {{ details }}
    </p>
  </v-alert>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonalAccountAlert } from "@overbookd/personal-account";
import { Money } from "~/utils/money/money";

const CP_RULES_EXPLAINED =
  "Les comptes persos ne peuvent exister que si tout le monde joue le jeu en restant dans le positif. Sinon ça veut dire que: Pas d'argent >> Pas de fûts >> Pas de rôtisserie >> Pas de manif >> Pas de manif.";
const CP_FEATURES_EXPLAINED =
  "Tu peux te servir de ton compte perso pour consommer des boissons ou de la nourriture disponible au local ou encore rembourser un autre membre de l'asso à la manière d'un Lydia.";

export default Vue.extend({
  name: "PersonalAccountAlert",
  props: {
    alert: {
      type: PersonalAccountAlert,
      required: true,
    },
  },
  computed: {
    isInDebt(): boolean {
      return this.alert.balance < 0;
    },
    color(): string {
      return this.isInDebt ? "error" : "info";
    },
    icon(): string {
      return this.isInDebt ? "mdi-nuke" : "mdi-information-outline";
    },
    details(): string {
      return this.isInDebt ? CP_RULES_EXPLAINED : CP_FEATURES_EXPLAINED;
    },
    statement(): string {
      return this.isInDebt ? "c'est déconné" : "tout est en règle";
    },
    balance(): string {
      return Money.displayCents(this.alert.balance)
    }
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
