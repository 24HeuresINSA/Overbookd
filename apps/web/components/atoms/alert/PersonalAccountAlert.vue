<template>
  <v-alert
    icon="mdi-nuke"
    color="error"
    variant="elevated"
    border="start"
    prominent
    closable
    class="px-16"
  >
    <h2 class="summary">{{ alert.summary }}</h2>
    <p class="details">
      Tu es à <strong>{{ balance }}</strong>, c'est déconné !
      <br />
      Les comptes persos ne peuvent exister que si tout le monde joue le jeu en
      restant dans le positif. Sinon ça veut dire que :
      <strong>Pas d'argent >> Pas de fûts >> Pas de manif >> Pas de manif.</strong>
    </p>

    <template #close>
      <v-btn
        icon="mdi-close"
        size="x-large"
        density="compact"
        @click="dismiss"
      />
    </template>
  </v-alert>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import { PersonalAccountAlert } from "@overbookd/personal-account";

const { alert } = defineProps({
  alert: {
    type: Object as PropType<PersonalAccountAlert>,
    required: true,
  },
});

const balance = computed<string>(() => Money.cents(alert.balance).toString());

const emit = defineEmits(["dismiss"]);
const dismiss = () => emit("dismiss");
</script>

<style lang="scss" scoped>
.summary {
  @media only screen and (max-width: $mobile-max-width) {
    font-size: large;
  }
}

.details {
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>
