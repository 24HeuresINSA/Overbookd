<template>
  <v-text-field
    v-model="displayedEuros"
    :label="hideLabel ? undefined : label"
    suffix="€"
    :rules="rules"
    :readonly="readonly"
    :hide-details="hideDetails"
    :density="density"
    @update:model-value="propagateValue"
    @update:error="propagateError"
  />
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import { min as minRule, max as maxRule } from "~/utils/rules/input.rules";
import {
  endByNumber,
  endByNumberSeparation,
  hasOneZeroAfterSeparator,
} from "~/utils/rules/money.utils";
import type { Density } from "~/utils/vuetify/component-props";

const emit = defineEmits(["update:model-value", "error"]);

const cents = defineModel<number>({ required: true });

const { min, max } = defineProps({
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
  max: {
    type: Number,
    default: undefined,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: false,
  },
  density: {
    type: String as PropType<Density>,
    default: "comfortable",
  },
});

const rules = computed(() => [
  minRule(Money.cents(min).inEuros),
  ...(max !== undefined ? [maxRule(Money.cents(max).inEuros)] : []),
]);

const displayedEuros = ref<string>(Money.cents(cents.value).inEuros.toString());

watch(cents, (value) => {
  displayedEuros.value = Money.cents(value).inEuros.toString();
});

const propagateValue = async (euros: string) => {
  await nextTick();

  const formatted = euros.replace(",", ".");
  if (endByNumberSeparation(euros) || hasOneZeroAfterSeparator(euros)) {
    displayedEuros.value = formatted;
    return;
  }

  if (!endByNumber(euros)) {
    displayedEuros.value = euros.slice(0, -1);
    return;
  }

  const money = Money.euros(Number(formatted));
  cents.value = money.inCents;
};
const propagateError = (isError: boolean) => emit("error", isError);
</script>
