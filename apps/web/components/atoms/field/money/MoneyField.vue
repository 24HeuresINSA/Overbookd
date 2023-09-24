<template>
  <v-text-field
    :value="valueInEuros"
    type="number"
    :label="label"
    suffix="€"
    :rules="[rules.number, rules.min]"
    @input="propagateValue"
    @update:error="propagateError"
  ></v-text-field>
</template>

<script lang="ts">
import Vue from "vue";
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
      return this.value / 100;
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
