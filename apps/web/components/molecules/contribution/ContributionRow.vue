<template>
  <tr>
    <td>{{ adherent.firstname }}</td>
    <td>{{ adherent.lastname }}</td>
    <td>{{ adherent.nickname }}</td>
    <td class="form">
      <MoneyField
        v-model="amount"
        :min="minimumContributionAmount"
        label=""
        @error="updateAmountValidity"
      />
      <v-btn
        color="primary"
        :disabled="isAmountInvalid"
        @click="payContribution"
      >
        Valider le paiement
      </v-btn>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from "vue";
import {
  Adherent,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
} from "@overbookd/contribution";
import MoneyField from "~/components/atoms/field/money/MoneyField.vue";

interface ContributionRowData {
  amount: number;
  isAmountInvalid: boolean;
}

export default Vue.extend({
  name: "ContributionRow",
  components: { MoneyField },
  props: {
    adherent: {
      type: Object as () => Adherent,
      required: true,
    },
  },
  data: (): ContributionRowData => ({
    amount: MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
    isAmountInvalid: false,
  }),
  computed: {
    minimumContributionAmount(): number {
      return MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
    },
  },
  methods: {
    payContribution() {
      this.$accessor.contribution.payContribution({
        adherent: this.adherent,
        amount: this.amount,
      });
    },
    updateAmountValidity(isInvalid: boolean) {
      this.isAmountInvalid = isInvalid;
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
</style>
