<template>
  <div class="payment-form">
    <MoneyField
      v-model="amount"
      :min="MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS"
      density="compact"
      class="payment-form__input"
      hide-label
      hide-details
    />
    <v-btn
      text="Valider le paiement"
      color="primary"
      :disabled="isAmountInvalid"
      class="payment-form__button"
      @click="payContribution"
    />
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
    type: Object as PropType<Adherent>,
    required: true,
  },
});

const amount = ref<number>(MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS);
const isAmountInvalid = computed<boolean>(() => {
  return amount.value < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
});

const payContribution = () => {
  if (isAmountInvalid.value) return;
  contributionStore.payContribution(adherent, amount.value);
};
</script>

<style lang="scss" scoped>
@use "./contribution-row-form.scss" as *;
</style>
