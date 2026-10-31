<template>
  <div class="payment-form">
    <v-btn
      v-for="{ title, value } in CONTRIBUTION_TYPE_ITEMS"
      :key="value"
      :text="title"
      color="primary"
      class="payment-form__button"
      @click="payContribution(value)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Adherent, ContributionType } from "@overbookd/contribution";
import { CONTRIBUTION_TYPE_ITEMS } from "~/utils/contribution/contribution.constant";

const contributionStore = useContributionStore();

const { adherent } = defineProps({
  adherent: {
    type: Object as PropType<Adherent>,
    required: true,
  },
});

const payContribution = (type: ContributionType) => {
  contributionStore.payContribution(adherent, type);
};
</script>

<style lang="scss" scoped>
@use "./contribution-row-form.scss" as *;
</style>
