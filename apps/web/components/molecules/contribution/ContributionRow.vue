<template>
  <tr>
    <td>{{ adherent?.firstname }}</td>
    <td>{{ adherent?.lastname }}</td>
    <td>{{ adherent?.nickname ?? "" }}</td>
    <td class="form">
      <v-text-field
        v-model="amount"
        type="number"
        suffix="€"
        class="amount-input"
        :rules="[rules.number, rules.min]"
      ></v-text-field>
      <v-btn color="primary" @click="payContribution">
        Valider le paiement
      </v-btn>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Adherent,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_EUROS,
} from "@overbookd/contribution";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

interface ContributionRowData extends InputRulesData {
  amount: number;
}

export default Vue.extend({
  name: "ContributionRow",
  props: {
    adherent: {
      type: Object as () => Adherent,
      required: true,
    },
  },
  data: (): ContributionRowData => ({
    amount: MINIMUM_CONTRIBUTION_AMOUNT_IN_EUROS,
    rules: {
      number: isNumber,
      min: min(MINIMUM_CONTRIBUTION_AMOUNT_IN_EUROS),
    },
  }),
  methods: {
    payContribution() {
      this.$accessor.contribution.payContribution({
        adherent: this.adherent,
        amount: this.amount,
      });
    },
    centsToEuros(cents: number): number {
      return cents / 100;
    },
  },
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.amount-input {
  width: 100px;
}
</style>
