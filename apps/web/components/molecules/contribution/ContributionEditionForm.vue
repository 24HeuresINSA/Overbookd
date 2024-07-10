<template>
  <div class="payment-form">
    <MoneyField
      v-model="amount"
      :min="MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS"
      hide-label
      hide-details
      dense
    />
    <v-btn
      text="Modifier"
      color="primary"
      :disabled="isAmountInvalid"
      @click="editContribution"
    />
    <v-btn text="Supprimer" color="error" @click="removeContribution" />
  </div>
</template>

<script lang="ts" setup>
import {
  type AdherentWithContribution,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
} from "@overbookd/contribution";

const contributionStore = useContributionStore();

const { adherent } = defineProps({
  adherent: {
    type: Object as () => AdherentWithContribution,
    required: true,
  },
});

const amount = ref(adherent.amount);

const isAmountInvalid = computed<boolean>(() => {
  return amount.value < MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
});

const editContribution = () => {
  if (isAmountInvalid.value) return;
  contributionStore.editContribution(adherent, amount.value);
};
const removeContribution = () => {
  contributionStore.removeContribution(adherent);
};
</script>

<style lang="scss" scoped>
.payment-form {
  display: flex;
  align-items: center;
  gap: 1rem;
}
</style>
