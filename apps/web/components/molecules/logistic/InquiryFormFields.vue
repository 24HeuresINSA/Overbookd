<template>
  <v-form class="inquiry-form">
    <v-text-field
      :model-value="quantity"
      type="number"
      label="Quantité"
      :rules="[isNumber, min(1)]"
      class="inquiry-form__quantity"
      :disabled="disabled"
      :hide-details="hideDetails"
      @update:model-value="updateQuantity"
      @keydown.enter="propagateEnter"
    />
    <SearchGear
      v-model="gear"
      class="inquiry-form__search"
      :ponctual-usage="ponctualUsage"
      :disabled="disabled"
      :hide-details="hideDetails"
      @enter="propagateEnter"
    />
  </v-form>
</template>

<script lang="ts" setup>
import type { CatalogGear } from "@overbookd/http";
import { isNumber, min } from "~/utils/rules/input.rules";

const gear = defineModel<CatalogGear>("gear", { required: false });
const quantity = defineModel<number>("quantity", { required: true });

defineProps({
  ponctualUsage: {
    type: Boolean,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:quantity", "enter"]);
const updateQuantity = (value: string) => emit("update:quantity", +value);
const propagateEnter = () => emit("enter");
</script>

<style lang="scss" scoped>
.inquiry-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-bottom: 0;

  &__quantity {
    width: 30%;
  }
  &__search {
    width: 70%;
  }

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
