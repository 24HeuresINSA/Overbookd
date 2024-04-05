<template>
  <v-text-field
    :value="euros"
    type="number"
    :solo="boxed"
    :filled="boxed"
    :outilned="!boxed"
    :label="label"
    suffix="€"
    :rules="[rules.number, rules.min]"
    :readonly="readonly"
    :hide-details="hideDetails"
    @input="propagateValue"
    @update:error="propagateError"
  ></v-text-field>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Money } from "@overbookd/money";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

export default defineComponent({
  name: "MoneyField",
  model: {
    prop: "value",
    event: "update:value",
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      default: "Montant",
    },
    min: {
      type: Number,
      default: 0,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:value", "error"],
  data(): InputRulesData {
    return {
      rules: {
        number: isNumber,
        min: min(Money.cents(this.min).inEuros),
      },
    };
  },
  computed: {
    euros(): number {
      return Money.cents(this.value).inEuros;
    },
  },
  methods: {
    propagateValue(euros: number) {
      this.$emit("update:value", Money.euros(euros).inCents);
    },
    propagateError(isError: boolean) {
      this.$emit("error", isError);
    },
  },
});
</script>
