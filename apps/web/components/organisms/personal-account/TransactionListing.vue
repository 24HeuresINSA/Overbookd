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
          <v-icon size="x-large">
            {{ getTransactionIcon(transaction.type) }}
          </v-icon>
          <span>
            {{ transaction.context }}
            {{ getTransferMessage(transaction) }}
          </span>
        </div>
        <span class="transaction__amount">{{ formatAmount(transaction) }}</span>
      </v-card-title>
      <v-card-subtitle class="transaction__subtitle">
        {{ formatDateWithExplicitMonthAndDay(transaction.date) }}
      </v-card-subtitle>
    </v-card>

    <h1 v-if="transactions.length === 0" class="no-transaction">
      Tu n'as aucune transaction pour le moment
    </h1>
  </div>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  TRANSFER,
  SHARED_MEAL,
  type MyTransaction,
  type TransactionType,
  doIReceive,
} from "@overbookd/personal-account";
import { formatDateWithExplicitMonthAndDay } from "~/utils/date/date.utils";
import { formatDisplayedNameWithLastname } from "~/utils/user/user.utils";

const transactionStore = useTransactionStore();
transactionStore.fetchMyTransactions();

const transactions = computed(() => transactionStore.myTransactions);

const isCredit = (transaction: MyTransaction) => {
  switch (transaction.type) {
    case BARREL:
    case PROVISIONS:
      return false;
    case DEPOSIT:
      return true;
    case TRANSFER:
    case SHARED_MEAL:
      return doIReceive(transaction);
  }
};
const isDebit = (transaction: MyTransaction) => !isCredit(transaction);
const getTransactionIcon = (type: TransactionType) => {
  switch (type) {
    case BARREL:
      return "mdi-glass-mug-variant";
    case DEPOSIT:
      return "mdi-transfer";
    case PROVISIONS:
      return "mdi-food";
    case TRANSFER:
      return "mdi-swap-vertical";
    case SHARED_MEAL:
      return "mdi-food-variant";
  }
};
const formatAmount = (transaction: MyTransaction) => {
  const symbol = isDebit(transaction) ? "-" : "";
  return `${symbol}${Money.cents(transaction.amount).toString()}`;
};
const getTransferMessage = (transaction: MyTransaction) => {
  switch (transaction.type) {
    case BARREL:
    case PROVISIONS:
    case DEPOSIT:
      return "";
    case TRANSFER:
    case SHARED_MEAL:
      return doIReceive(transaction)
        ? `(de ${formatDisplayedNameWithLastname(transaction.from)})`
        : `(vers ${formatDisplayedNameWithLastname(transaction.to)})`;
  }
};
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
    width: 50%;
  }
}

.transaction {
  flex-shrink: 0;

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
    padding: 16px;
    white-space: normal;
    word-break: break-word;

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
    word-break: normal;
    word-wrap: normal;

    @media screen and (max-width: $mobile-max-width) {
      font-size: 1.6rem;
      min-width: 25%;
    }
  }

  &__subtitle {
    margin-top: -16px;
    padding-bottom: 16px;
  }
}

.no-transaction {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 10px;
}
</style>
