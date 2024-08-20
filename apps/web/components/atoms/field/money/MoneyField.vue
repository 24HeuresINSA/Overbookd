<template>
  <v-text-field
    v-model="displayedEuros"
    :label="hideLabel ? undefined : label"
    suffix="€"
    :rules="[rules.min]"
    :readonly="readonly"
    :hide-details="hideDetails"
    :density="density"
    @update:model-value="propagateValue"
    @update:error="propagateError"
  />
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import { min as minRule } from "~/utils/rules/input.rules";
import { endByNumber, endByNumberSeparation } from "~/utils/rules/money.utils";
import type { Density } from "~/utils/vuetify/component-props";

const emit = defineEmits(["update:model-value", "error"]);

const euros = defineModel<number>({ required: true });

const { label, min, readonly, hideDetails } = defineProps({
  label: {
    type: String,
    default: "Montant",
  },
  hideLabel: {
    type: Boolean,
    default: false,
  },
  min: {
    type: Number,
    default: 0,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String as PropType<Density>,
    default: "comfortable",
  },
});

const rules = {
  min: minRule(Money.cents(min).inEuros),
};

const displayedEuros = ref<string>(Money.cents(euros.value).inEuros.toString());

watch(euros, (value) => {
  displayedEuros.value = Money.cents(value).inEuros.toString();
});

const propagateValue = (euros: string) => {
  const formatted = euros.replace(",", ".");
  if (endByNumberSeparation(euros)) {
    displayedEuros.value = formatted;
    return;
  }

  if (!endByNumber(euros)) {
    displayedEuros.value = euros.slice(0, -1);
    return;
  }

  const money = Money.euros(Number(formatted));
  displayedEuros.value = money.inEuros.toString();
  emit("update:model-value", money.inCents);
};
const propagateError = (isError: boolean) => emit("error", isError);
</script>
