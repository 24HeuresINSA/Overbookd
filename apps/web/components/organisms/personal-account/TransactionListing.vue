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
          <span>
            {{ transaction.context }}
            {{ getTransferMessage(transaction) }}
          </span>
        </div>
        <span class="transaction__amount">{{ formatAmount(transaction) }}</span>
      </v-card-title>
      <v-card-subtitle>
        {{ formatDate(transaction.date) }}
      </v-card-subtitle>
    </v-card>

    <h1 v-if="transactions.length === 0" class="no-transaction">
      Tu n'as aucune transaction pour le moment
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDateWithExplicitMonthAndDay } from "~/utils/date/date.utils";
import { Money } from "~/utils/money/money";
import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  TRANSFER,
  Transaction,
  TransactionType,
  doIReceive,
} from "@overbookd/personal-account";
import { formatDisplayedNameWithLastname } from "~/utils/user/user.utils";

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
    isCredit(transaction: Transaction): boolean {
      switch (transaction.type) {
        case BARREL:
        case PROVISIONS:
          return false;
        case DEPOSIT:
          return true;
        case TRANSFER:
          return doIReceive(transaction);
      }
    },
    isDebit(transaction: Transaction): boolean {
      return !this.isCredit(transaction);
    },
    getTransactionIcon(type: TransactionType): string {
      switch (type) {
        case BARREL:
          return "mdi-glass-mug-variant";
        case DEPOSIT:
          return "mdi-transfer";
        case PROVISIONS:
          return "mdi-food";
        case TRANSFER:
          return "mdi-swap-vertical";
      }
    },
    formatAmount(transaction: Transaction): string {
      const symbol = this.isDebit(transaction) ? "-" : "";
      return `${symbol}${Money.displayCents(transaction.amount)}`;
    },
    formatDate(date: Date): string {
      return formatDateWithExplicitMonthAndDay(date);
    },
    isTransfer(transaction: Transaction): boolean {
      return transaction.type === TRANSFER;
    },
    getTransferMessage(transaction: Transaction): string {
      switch (transaction.type) {
        case BARREL:
        case PROVISIONS:
        case DEPOSIT:
          return "";
        case TRANSFER:
          return doIReceive(transaction)
            ? `(de ${formatDisplayedNameWithLastname(transaction.from)})`
            : `(vers ${formatDisplayedNameWithLastname(transaction.to)})`;
      }
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

    @media screen and (max-width: $mobile-max-width) {
      gap: 10px;
    }
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

    @media screen and (max-width: $mobile-max-width) {
      font-size: 1.6rem;
      min-width: 25%;
    }
  }
}

.no-transaction {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 10px;
}
</style>
