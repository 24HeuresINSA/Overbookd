<template>
  <div class="transactions">
    <v-card
      v-for="transaction in transactions"
      :key="`${transaction.type}-
        ${transaction.amount}-
        ${transaction.date.getTime()}`"
      class="transaction"
      :class="{
        credit: isCredit(transaction),
        debit: isDebit(transaction),
      }"
    >
      <v-card-title class="transaction__title">
        <div class="transaction__context">
          <v-icon x-large>{{ getTransactionIcon(transaction.type) }}</v-icon>
          <span>{{ transaction.context }}</span>
        </div>
        <span class="transaction__amount">{{ formatAmount(transaction) }}</span>
      </v-card-title>
      <v-card-subtitle>
        {{ formatDate(transaction.date) }}
      </v-card-subtitle>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";
import { Money } from "~/utils/money/money";
import {
  Transaction,
  TransactionType,
  doIReceive,
} from "@overbookd/personal-account";

export default defineComponent({
  name: "TransactionListing",
  computed: {
    transactions(): Transaction[] {
      return this.$accessor.transaction.myTransactions;
    },
  },
  async created() {
    await this.$accessor.transaction.fetchMyTransactions();
  },
  methods: {
    isDebit(transaction: Transaction): boolean {
      switch (transaction.type) {
        case "BARREL":
        case "PROVISIONS":
          return true;
        case "DEPOSIT":
          return false;
        case "TRANSFER":
          return doIReceive(transaction);
      }
    },
    isCredit(transaction: Transaction): boolean {
      return !this.isDebit(transaction);
    },
    getTransactionIcon(type: TransactionType): string {
      switch (type) {
        case "BARREL":
          return "mdi-glass-mug-variant";
        case "DEPOSIT":
          return "mdi-transfer";
        case "PROVISIONS":
          return "mdi-food";
        case "TRANSFER":
          return "mdi-swap-vertical";
      }
    },
    formatAmount(transaction: Transaction): string {
      const symbol = this.isDebit(transaction) ? "-" : "";
      return `${symbol}${Money.displayCents(transaction.amount)}`;
    },
    formatDate(date: Date): string {
      return formatDateToHumanReadable(date);
    },
  },
});
</script>

<style lang="scss" scoped>
.transactions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  margin-bottom: 70px;

  @media screen and (min-width: $mobile-max-width) {
    overflow-y: auto;
    margin-bottom: 0;
    min-width: 50%;
  }
}

.transaction {
  &.credit {
    background-color: rgba(0, 255, 0, 0.05);

    .v-icon {
      color: darkgreen;
    }
  }

  &.debit {
    background-color: rgba(255, 0, 0, 0.05);

    .v-icon {
      color: darkred;
    }
  }

  &__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: 20px;
  }

  &__context {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__amount {
    font-size: 2rem;
    min-width: 15%;
    text-align: right;
  }
}
</style>
