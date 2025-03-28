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
import { type MyTransaction, isCredit } from "@overbookd/personal-account";
import { formatDateWithExplicitMonthAndDay } from "@overbookd/time";
import {
  isDebit,
  getTransactionIcon,
  formatAmount,
  getTransferMessage,
} from "~/utils/transaction/transaction.utils";

const transactionStore = useTransactionStore();

const transactions = computed<MyTransaction[]>(() =>
  transactionStore.myTransactions.toReversed(),
);
</script>

<style lang="scss" scoped>
$title-height: calc(1rem + 10px);

.transactions {
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media screen and (min-width: $mobile-max-width) {
    height: calc(
      100vh - $header-height - 2 * $desktop-content-vertical-padding -
        $title-height - 15px
    );
    overflow-y: auto;
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
