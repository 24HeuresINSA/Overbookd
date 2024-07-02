<template>
  <div class="payment-form">
    <MoneyField
      v-model="amount"
      :min="MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS"
      hide-label
      hide-details
    />
    <v-btn color="primary" :disabled="isAmountInvalid" @click="payContribution">
      Valider le paiement
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import {
  type Adherent,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
} from "@overbookd/contribution";

const contributionStore = useContributionStore();

const { adherent } = defineProps({
  adherent: {
    type: Object as () => Adherent,
    required: true,
  },
});

const amount = ref(MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS);
const isAmountInvalid = computed<boolean>(() => {
  return amount.value < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
});

const payContribution = () => {
  if (isAmountInvalid.value) return;
  contributionStore.payContribution(adherent, amount.value);
};
</script>

<style lang="scss" scoped>
.payment-form {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
