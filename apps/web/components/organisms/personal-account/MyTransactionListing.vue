<template>
  <v-card class="transactions">
    <div ref="header" class="transactions__header">
      <v-card-title class="home-card__title">
        <v-icon icon="mdi-format-list-bulleted" />
        <span>Mes transactions</span>
      </v-card-title>

      <v-chip-group
        v-if="availableTypes.length > 1"
        v-model="selectedTypes"
        class="transactions__filters"
        selected-class="text-primary"
        multiple
        column
      >
        <v-chip
          v-for="type in availableTypes"
          :key="type"
          :value="type"
          :prepend-icon="getTransactionIcon(type)"
          :text="getTransactionTypeLabel(type)"
          variant="outlined"
          filter
        />
      </v-chip-group>
    </div>

    <v-list
      v-if="months.length > 0"
      class="transactions__list pt-0"
      lines="two"
    >
      <template v-for="month in months" :key="month.label">
        <v-list-subheader
          class="month"
          role="button"
          tabindex="0"
          :aria-expanded="!isCollapsed(month)"
          sticky
          @click="toggleMonth(month)"
          @keydown.enter.space.prevent="toggleMonth(month)"
        >
          <span class="month__label">
            <v-icon
              :icon="
                isCollapsed(month) ? 'mdi-chevron-right' : 'mdi-chevron-down'
              "
              size="small"
            />
            {{ month.label }}
          </span>
          <span
            class="month__total"
            :class="month.total < 0 ? 'text-error' : 'text-success'"
          >
            {{ formatSignedCents(month.total) }}
          </span>
        </v-list-subheader>
        <template
          v-for="(transaction, index) in isCollapsed(month)
            ? []
            : month.transactions"
          :key="`${transaction.type}-${transaction.date.getTime()}-${index}`"
        >
          <v-divider v-if="index > 0" inset />
          <v-list-item>
            <template #prepend>
              <v-avatar
                :color="isCredit(transaction) ? 'success' : 'error'"
                variant="tonal"
              >
                <v-icon :icon="getTransactionIcon(transaction.type)" />
              </v-avatar>
            </template>
            <v-list-item-title class="transaction__context">
              {{ transaction.context }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ formatDateWithExplicitMonthAndDay(transaction.date) }}
              {{ getTransferMessage(transaction) }}
            </v-list-item-subtitle>
            <template #append>
              <span
                class="transaction__amount"
                :class="isCredit(transaction) ? 'text-success' : 'text-error'"
              >
                {{ formatAmount(transaction) }}
              </span>
            </template>
          </v-list-item>
        </template>
      </template>
    </v-list>

    <div v-else class="transactions__empty">
      <v-icon icon="mdi-cash-remove" size="64" />
      <p>{{ emptyMessage }}</p>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import {
  type MyTransaction,
  type TransactionType,
  isCredit,
} from "@overbookd/personal-account";
import { formatDateWithExplicitMonthAndDay } from "@overbookd/time";
import { Money } from "@overbookd/money";
import { useElementSize } from "@vueuse/core";
import {
  getTransactionIcon,
  getTransactionTypeLabel,
  formatAmount,
  getTransferMessage,
  byMostRecent,
} from "~/utils/transaction/transaction.utils";

type TransactionMonth = {
  label: string;
  total: number;
  transactions: MyTransaction[];
};

const transactionStore = useTransactionStore();

const header = useTemplateRef<HTMLElement>("header");
const { height } = useElementSize(header, undefined, { box: "border-box" });
const headerHeight = computed<string>(() => `${height.value}px`);

const transactions = computed<MyTransaction[]>(() =>
  transactionStore.myTransactions.toSorted(byMostRecent),
);

const availableTypes = computed<TransactionType[]>(() => [
  ...new Set(transactions.value.map(({ type }) => type)),
]);
const selectedTypes = ref<TransactionType[]>([]);

const collapsedMonths = ref<string[]>([]);
const isCollapsed = ({ label }: TransactionMonth): boolean =>
  collapsedMonths.value.includes(label);
const toggleMonth = ({ label }: TransactionMonth) => {
  collapsedMonths.value = collapsedMonths.value.includes(label)
    ? collapsedMonths.value.filter((collapsed) => collapsed !== label)
    : [...collapsedMonths.value, label];
};

const filteredTransactions = computed<MyTransaction[]>(() => {
  if (selectedTypes.value.length === 0) return transactions.value;
  return transactions.value.filter(({ type }) =>
    selectedTypes.value.includes(type),
  );
});

const monthFormatter = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});
const months = computed<TransactionMonth[]>(() => {
  const byMonth = new Map<string, TransactionMonth>();
  for (const transaction of filteredTransactions.value) {
    const label = monthFormatter.format(transaction.date);
    const month = byMonth.get(label) ?? { label, total: 0, transactions: [] };
    const signedAmount = isCredit(transaction)
      ? transaction.amount
      : -transaction.amount;
    month.total += signedAmount;
    month.transactions.push(transaction);
    byMonth.set(label, month);
  }
  return [...byMonth.values()];
});

const emptyMessage = computed<string>(() =>
  transactions.value.length === 0
    ? "Tu n'as aucune transaction pour le moment"
    : "Aucune transaction ne correspond aux filtres",
);

const formatSignedCents = (cents: number): string => {
  const sign = cents > 0 ? "+" : "";
  return `${sign}${Money.cents(cents).toString()}`;
};
</script>

<style lang="scss" scoped>
@use "~/components/organisms/home-dashboard/home-dashboard.scss" as *;

.transactions {
  display: flex;
  flex-direction: column;

  @media screen and (min-width: calc($mobile-max-width + 0.1px)) {
    &__list {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
  }

  &__header {
    flex-shrink: 0;
  }

  &__filters {
    padding: 8px 16px 0;
  }

  @media screen and (max-width: $mobile-max-width) {
    overflow: clip;

    &__header {
      position: sticky;
      top: -$mobile-content-padding;
      z-index: 2;
      background-color: rgb(var(--v-theme-surface));
    }

    &__list {
      overflow: clip;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 40px 20px;
    text-align: center;
    font-size: 1.1rem;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }
}

.month {
  background-color: rgb(var(--v-theme-surface));
  z-index: 1;
  cursor: pointer;
  user-select: none;

  @media screen and (max-width: $mobile-max-width) {
    top: calc(v-bind(headerHeight) - #{$mobile-content-padding});
  }

  &:hover,
  &:focus-visible {
    background-image: linear-gradient(
      rgba(var(--v-theme-on-surface), 0.05),
      rgba(var(--v-theme-on-surface), 0.05)
    );
  }

  :deep(.v-list-subheader__text) {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 4px;
    text-transform: capitalize;
    font-weight: 600;
  }

  &__total {
    font-weight: 600;
  }
}

.transaction {
  &__context {
    white-space: normal;
  }

  &__amount {
    margin-left: 12px;
    font-size: 1rem;
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
