<template>
  <div class="payment-form">
    <v-select
      v-model="type"
      :items="CONTRIBUTION_TYPE_ITEMS"
      density="compact"
      class="payment-form__input"
      hide-details
    />
    <v-btn
      text="Modifier"
      color="primary"
      :disabled="type === adherent.type"
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
import type {
  AdherentWithContribution,
  ContributionType,
} from "@overbookd/contribution";
import { CONTRIBUTION_TYPE_ITEMS } from "~/utils/contribution/contribution.constant";

const contributionStore = useContributionStore();

const { adherent } = defineProps({
  adherent: {
    type: Object as PropType<AdherentWithContribution>,
    required: true,
  },
});

const type = ref<ContributionType>(adherent.type);

const editContribution = () => {
  contributionStore.editContribution(adherent, type.value);
};
const removeContribution = () => {
  contributionStore.removeContribution(adherent);
};
</script>

<style lang="scss" scoped>
@use "./contribution-row-form.scss" as *;
</style>
