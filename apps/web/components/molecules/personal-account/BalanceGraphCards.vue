<template>
  <div class="balance-cards">
    <v-card>
      <v-card-title> Solde du CP </v-card-title>
      <v-card-text>
        <span
          class="balance"
          :class="{ negative: balance < 0, positive: balance > 0 }"
        >
          {{ displayableBalance }}
        </span>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Evolution du CP</v-card-title>
      <v-card-text>
        <Line :options="options" :data="data" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { ChartData, ChartOptions } from "chart.js";
import { Line } from "vue-chartjs";
import "chartjs-adapter-luxon";
import type { MyTransaction } from "@overbookd/personal-account";
import { Money } from "@overbookd/money";
import { calculateBalanceByDates } from "~/utils/transaction/balance.graph";
import { getBorderColorForAmount } from "~/utils/transaction/border-color.graph";

const userStore = useUserStore();
const transactionStore = useTransactionStore();

const balance = computed<number>(() => userStore.loggedUser?.balance ?? 0);
const displayableBalance = computed<string>(() =>
  Money.cents(balance.value).toString(),
);
const transactions = computed<MyTransaction[]>(
  () => transactionStore.myTransactions,
);
const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 2,
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
    ...calculateBalanceByDates(transactions.value),
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
.balance-cards {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.balance {
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1.2;
}

.negative {
  color: rgb(var(--v-theme-error));
}
.positive {
  color: rgb(var(--v-theme-success));
}
</style>
