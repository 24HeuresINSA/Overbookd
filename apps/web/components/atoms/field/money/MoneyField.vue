<template>
  <v-text-field
    :value="valueInEuros"
    type="number"
    :label="label"
    suffix="€"
    :rules="[rules.number, rules.min]"
    :readonly="readonly"
    @input="propagateValue"
    @update:error="propagateError"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
import { Money } from "~/utils/money/money";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

export default Vue.extend({
  name: "MoneyField",
  model: {
    prop: "value",
    event: "change",
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
  },
  data(): InputRulesData {
    return {
      rules: {
        number: isNumber,
        min: min(this.min / 100),
      },
    };
  },
  computed: {
    valueInEuros(): number {
      return Money.inEuros(this.value);
    },
  },
  methods: {
    propagateValue(euros: number) {
      this.$emit("change", Math.floor(euros * 100));
    },
    propagateError(isError: boolean) {
      this.$emit("error", isError);
    },
  },
});
</script>
