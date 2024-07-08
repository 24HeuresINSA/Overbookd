<template>
  <v-form class="inquiry-form">
    <v-text-field
      v-model="quantity"
      type="number"
      label="Quantité"
      :rules="[rules.number, rules.min]"
      class="inquiry-form__quantity"
      :disabled="disabled"
    />
    <SearchGear
      v-model="gear"
      class="inquiry-form__search"
      :ponctual-usage="ponctualUsage"
      :disabled="disabled"
    />
  </v-form>
</template>

<script lang="ts" setup>
import type { CatalogGear } from "@overbookd/http";
import { isNumber, min } from "~/utils/rules/input.rules";

const gear = defineModel<CatalogGear | null>("gear", { required: true });
const quantity = defineModel<number>("quantity", { required: true });

const { disabled, ponctualUsage } = defineProps({
  ponctualUsage: {
    type: Boolean,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const rules = { number: isNumber, min: min(1) };
</script>

<style lang="scss" scoped>
.inquiry-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__quantity,
    &__search {
      width: 100%;
    }
  }
}
</style>
