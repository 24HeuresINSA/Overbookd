<template>
  <v-card :to="MY_PERSONAL_ACCOUNT_URL" class="home-card personal-account" link>
    <v-card-title class="home-card__title">
      <v-icon>mdi-account-cash</v-icon>
      <span>Compte perso</span>
    </v-card-title>

    <v-card-text class="home-card__content">
      <h2 class="personal-account__balance" :class="balanceClassColor">
        {{ displayedBalance }}
      </h2>
      <v-list
        v-if="transactions.length > 0"
        max-height="300"
        class="personal-account__transactions"
      >
        <v-list-item
          v-for="transaction in transactions"
          :key="`${transaction.type}-
            ${transaction.amount}-
            ${transaction.date.getTime()}`"
          class="transaction"
          slim
        >
          <template #prepend>
            <div
              class="transaction__prepend-icon"
              :class="`${getTransactionClassColor(transaction)}-background`"
            >
              <v-icon :class="getTransactionClassColor(transaction)">
                {{ getTransactionIcon(transaction.type) }}
              </v-icon>
            </div>
          </template>
          <template #title>
            <span class="transaction__title">
              {{ transaction.context }} {{ getTransferMessage(transaction) }}
            </span>
          </template>
          <template #subtitle>
            <span class="transaction__subtitle">
              {{ formatDateWithExplicitMonthAndDay(transaction.date) }}
            </span>
          </template>
          <template #append>
            <span :class="getTransactionClassColor(transaction)">
              {{ formatAmount(transaction) }}
            </span>
          </template>
        </v-list-item>
      </v-list>
      <span v-else class="no-content-label">
        Ton CP est vide 😱<br />
        Pense à recharger ton compte pour consommer au local !
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import type { MyTransaction } from "@overbookd/personal-account";
import { formatDateWithExplicitMonthAndDay } from "@overbookd/time";
import { MY_PERSONAL_ACCOUNT_URL } from "@overbookd/web-page";
import {
  getTransactionIcon,
  formatAmount,
  getTransferMessage,
  isDebit,
} from "~/utils/transaction/transaction.utils";

const POSITIVE = "positive";
const NEGATIVE = "negative";

const userStore = useUserStore();
const transactionStore = useTransactionStore();

transactionStore.fetchMyTransactions();

const loggedUser = computed(() => userStore.loggedUser);

const myBalance = computed(() => loggedUser.value?.balance ?? 0);
const displayedBalance = computed<string>(() =>
  Money.cents(myBalance.value).toString(),
);
const balanceClassColor = computed<string>(() => {
  if (myBalance.value < 0) return NEGATIVE;
  if (myBalance.value > 0) return POSITIVE;
  return "";
});

const getTransactionClassColor = (transaction: MyTransaction): string => {
  return isDebit(transaction) ? NEGATIVE : POSITIVE;
};

const transactions = computed<MyTransaction[]>(
  () => transactionStore.myTransactions,
);
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.personal-account {
  &__balance {
    display: flex;
    font-size: 1.8rem;
    justify-content: center;
    font-weight: 500;
    margin: 5px 0;
  }
  &__transactions {
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--v-theme-secondary)) rgb(var(--v-theme-surface));
    &::-webkit-scrollbar {
      width: 5px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgb(var(--v-theme-secondary));
    }
  }
}

.transaction {
  padding-inline: 10px !important;
  &__prepend-icon {
    border-radius: 5px;
    padding: 7px;
    background-color: rgba(var(--v-theme-secondary), 0.4);
    .v-icon {
      font-size: 1.4rem;
    }
  }
  &__title {
    font-size: 0.9rem;
  }
  &__subtitle {
    font-size: 0.75rem;
    opacity: 0.8;
  }
}

:deep(.v-list-item__spacer) {
  width: 8px !important;
}

.positive {
  color: rgb(var(--v-theme-success));
}
.positive-background {
  background-color: rgba(var(--v-theme-success), 0.1);
}
.negative {
  color: rgb(var(--v-theme-error));
}
.negative-background {
  background-color: rgba(var(--v-theme-error), 0.1);
}
</style>
