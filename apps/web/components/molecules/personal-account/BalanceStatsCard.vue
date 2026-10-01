<template>
  <v-card>
    <v-card-title class="home-card__title stats-title">
      <v-icon icon="mdi-chart-line" />
      <span>Stats</span>
      <v-chip-group
        v-model="period"
        class="stats-title__period"
        selected-class="text-primary"
        mandatory
      >
        <v-chip
          :value="THIS_MONTH"
          text="Ce mois"
          size="small"
          variant="outlined"
        />
        <v-chip
          :value="THREE_MONTHS"
          text="3 mois"
          size="small"
          variant="outlined"
        />
        <v-chip :value="ALL_TIME" text="Tout" size="small" variant="outlined" />
      </v-chip-group>
    </v-card-title>
    <v-card-text>
      <p class="subtitle mt-2">Évolution du solde</p>
      <div class="graph">
        <Line :options="options" :data="data" />
      </div>
      <v-divider class="my-4" />
      <TransactionSourcesChart :transactions="periodTransactions" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "vue-chartjs";
import "chartjs-adapter-luxon";
import type { MyTransaction } from "@overbookd/personal-account";
import { Money } from "@overbookd/money";
import { calculateBalanceByDates } from "~/utils/transaction/balance.graph";
import { getBorderColorForAmount } from "~/utils/transaction/border-color.graph";

const THIS_MONTH = "this-month";
const THREE_MONTHS = "three-months";
const ALL_TIME = "all-time";
type StatsPeriod = typeof THIS_MONTH | typeof THREE_MONTHS | typeof ALL_TIME;

const myStore = useMyStore();
const transactionStore = useTransactionStore();

const balance = computed<number>(() => myStore.loggedUser?.balance ?? 0);
const transactions = computed<MyTransaction[]>(
  () => transactionStore.myTransactions,
);

const period = ref<StatsPeriod>(THIS_MONTH);

const periodStart = computed<Date | undefined>(() => {
  if (period.value === ALL_TIME) return undefined;
  const now = new Date();
  const monthsBack = period.value === THREE_MONTHS ? 2 : 0;
  return new Date(now.getFullYear(), now.getMonth() - monthsBack, 1);
});
const periodTransactions = computed<MyTransaction[]>(() => {
  const start = periodStart.value;
  if (!start) return transactions.value;
  return transactions.value.filter(({ date }) => date >= start);
});

const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: "time",
      display: false,
      border: { display: false },
      grid: { display: false, drawTicks: false },
    },
    y: {
      beginAtZero: true,
      border: { display: false },
    },
  },
  plugins: { legend: { display: false } },
  elements: { point: { radius: 0 } },
} as const;

const data = computed<ChartData<"line">>(() => {
  const currentBalance = { date: new Date(), balance: balance.value };
  const balanceByDates = [
    ...calculateBalanceByDates(transactions.value, periodStart.value),
    currentBalance,
  ];
  const labels = balanceByDates.map(({ date }) => date.getTime());
  const data = balanceByDates.map(
    ({ balance }) => Money.cents(balance).inEuros,
  );

  return {
    labels,
    datasets: [
      {
        label: "Solde",
        data,
        tension: 0.3,
        segment: { borderColor: getBorderColorForAmount },
        borderWidth: 2,
      },
    ],
  };
});
</script>

<style lang="scss" scoped>
@use "~/components/organisms/home-dashboard/home-dashboard.scss" as *;

.stats-title {
  flex-wrap: wrap;

  &__period {
    margin-left: auto;
  }
}

.subtitle {
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.graph {
  margin-top: 8px;
  position: relative;
  height: 160px;

  @media screen and (max-width: $mobile-max-width) {
    height: 140px;
  }
}
</style>
