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
      text="Modifier"
      color="primary"
      :disabled="isAmountInvalid"
      class="payment-form__button"
      @click="editContribution"
    />
    <v-btn
      text="Supprimer"
      color="tertiary"
      class="payment-form__button"
      @click="removeContribution"
    />
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
    type: Object as PropType<AdherentWithContribution>,
    required: true,
  },
});

const amount = ref<number>(adherent.amount);

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
@use "./contribution-row-form.scss" as *;
</style>
