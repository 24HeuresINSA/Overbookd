<template>
  <div class="sources">
    <section
      v-for="source in sources"
      :key="source.title"
      class="source"
      :aria-label="`${source.title} par type`"
    >
      <p class="subtitle">{{ source.title }}</p>
      <div class="source__chart">
        <Doughnut
          v-if="source.total > 0"
          :options="doughnutOptions"
          :data="toDoughnutData(source.slices)"
        />
        <div v-else class="source__placeholder" />
        <span class="source__total" :class="source.totalClass">
          {{ Money.cents(source.total).toString() }}
        </span>
      </div>
      <ul v-if="source.total > 0" class="legend">
        <li v-for="slice in sortByAmount(source.slices)" :key="slice.type">
          <span
            class="legend__swatch"
            :style="{ backgroundColor: colorOf(slice.type) }"
          />
          <span class="legend__label">
            {{ getTransactionTypeLabel(slice.type) }}
          </span>
          <span class="legend__amount">
            {{ Money.cents(slice.amount).toString() }}
          </span>
        </li>
      </ul>
      <p v-else class="source__empty">{{ source.emptyLabel }}</p>
    </section>
  </div>
</template>

<script lang="ts" setup>
import type { ChartData, ChartOptions } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { useTheme } from "vuetify";
import {
  type MyTransaction,
  type TransactionType,
  BARREL,
  DEPOSIT,
  EXTERNAL_EVENT,
  INITIALIZATION,
  PROVISIONS,
  SHARED_MEAL,
  TRANSFER,
  isCredit,
} from "@overbookd/personal-account";
import { Money } from "@overbookd/money";
import { getTransactionTypeLabel } from "~/utils/transaction/transaction.utils";

const TYPE_ORDER: TransactionType[] = [
  BARREL,
  PROVISIONS,
  SHARED_MEAL,
  TRANSFER,
  EXTERNAL_EVENT,
  DEPOSIT,
  INITIALIZATION,
];
const LIGHT_COLORS = [
  "#2a78d6",
  "#eb6834",
  "#1baf7a",
  "#eda100",
  "#e87ba4",
  "#008300",
  "#4a3aa7",
];
const DARK_COLORS = [
  "#3987e5",
  "#d95926",
  "#199e70",
  "#c98500",
  "#d55181",
  "#008300",
  "#9085e9",
];

type Slice = { type: TransactionType; amount: number };
type Source = {
  title: string;
  total: number;
  totalClass: string;
  emptyLabel: string;
  slices: Slice[];
};

const { transactions } = defineProps({
  transactions: {
    type: Array as PropType<MyTransaction[]>,
    required: true,
  },
});

const theme = useTheme();

const sumByType = (list: MyTransaction[]): Slice[] =>
  TYPE_ORDER.map((type) => ({
    type,
    amount: list
      .filter((transaction) => transaction.type === type)
      .reduce((sum, { amount }) => sum + amount, 0),
  })).filter(({ amount }) => amount > 0);

const sources = computed<Source[]>(() => {
  const spent = sumByType(
    transactions.filter((transaction) => !isCredit(transaction)),
  );
  const received = sumByType(transactions.filter(isCredit));
  const total = (slices: Slice[]) =>
    slices.reduce((sum, { amount }) => sum + amount, 0);

  return [
    {
      title: "Dépenses",
      total: total(spent),
      totalClass: "text-error",
      emptyLabel: "Aucune dépense",
      slices: spent,
    },
    {
      title: "Entrées",
      total: total(received),
      totalClass: "text-success",
      emptyLabel: "Aucune entrée",
      slices: received,
    },
  ];
});

const isDark = computed<boolean>(() => theme.global.current.value.dark);
const colorOf = (type: TransactionType): string => {
  const colors = isDark.value ? DARK_COLORS : LIGHT_COLORS;
  return colors[TYPE_ORDER.indexOf(type)] ?? colors[0];
};
const sortByAmount = (slices: Slice[]): Slice[] =>
  slices.toSorted((a, b) => b.amount - a.amount);

const toDoughnutData = (slices: Slice[]): ChartData<"doughnut"> => ({
  labels: slices.map(({ type }) => getTransactionTypeLabel(type)),
  datasets: [
    {
      data: slices.map(({ amount }) => Money.cents(amount).inEuros),
      backgroundColor: slices.map(({ type }) => colorOf(type)),
      borderColor: theme.global.current.value.colors.surface,
      borderWidth: 2,
      borderRadius: 4,
    },
  ],
});

const doughnutOptions: ChartOptions<"doughnut"> = {
  responsive: true,
  maintainAspectRatio: false,
  rotation: -90,
  circumference: 180,
  cutout: "68%",
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: ({ label, parsed }) =>
          `${label} : ${Money.euros(parsed).toString()}`,
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.subtitle {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.sources {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.source {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;

  &__chart {
    position: relative;
    height: 90px;
  }

  &__placeholder {
    width: 160px;
    max-width: 100%;
    aspect-ratio: 2;
    margin: 0 auto;
    border: 14px solid rgba(var(--v-theme-on-surface), 0.08);
    border-bottom: none;
    border-radius: 160px 160px 0 0;
  }

  &__total {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    font-size: 1rem;
    font-weight: 600;
  }

  &__empty {
    text-align: center;
    font-size: 0.8rem;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }
}

.legend {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.8rem;

  li {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__swatch {
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    border-radius: 3px;
  }

  &__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__amount {
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
