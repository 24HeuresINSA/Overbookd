<template>
  <Line :data="courbs" :options="options" class="vuetify-card chart" />
</template>

<script lang="ts" setup>
import { Line } from "vue-chartjs";
import type { OrgaNeedDetails } from "@overbookd/http";
import type { ChartData, Dataset } from "~/utils/chartjs-graph";
import type { ActiveElement, ChartEvent } from "chart.js";
import { useTheme } from "vuetify";
import { hexToRGBA } from "~/utils/hex-to-rgba.utils";

const orgaNeedStore = useOrgaNeedStore();
const theme = useTheme();

const emit = defineEmits(["select:details"]);

const COMMON_DATASET_OPTIONS = {
  borderWidth: 2,
  pointRadius: 0,
  pointHitRadius: 10,
  fill: true,
};

const stats = computed<OrgaNeedDetails[]>(() => orgaNeedStore.stats);

const labels = computed<string[]>(() =>
  stats.value.map((stat) => stat.start.toLocaleString()),
);

const availableVolunteers = computed<Dataset>(() => ({
  label: "Bénevoles disponibles",
  data: stats.value.map((stat) => stat.availableVolunteers),
  backgroundColor: "#00ff0030",
  borderColor: "#00ff00",
  yAxisID: "yStacked",
  ...COMMON_DATASET_OPTIONS,
}));
const assignedVolunteers = computed<Dataset>(() => ({
  label: "Bénevoles assignés",
  data: stats.value.map((stat) => stat.assignedVolunteers),
  backgroundColor: "#0000ff30",
  borderColor: "#0000ff",
  yAxisID: "yStacked",
  ...COMMON_DATASET_OPTIONS,
}));
const requestedVolunteers = computed<Dataset>(() => ({
  label: "Bénevoles demandés",
  data: stats.value.map((stat) => stat.requestedVolunteers),
  backgroundColor: "#ff000030",
  borderColor: "#ff0000",
  yAxisID: "yRequested",
  ...COMMON_DATASET_OPTIONS,
}));

const courbs = computed<ChartData>(() => ({
  labels: labels.value,
  datasets: [
    requestedVolunteers.value,
    assignedVolunteers.value,
    availableVolunteers.value,
  ],
}));

const max = computed<number>(() => {
  const TOP_MARGING = 1.05;
  const STEP = 50;

  const assigned = assignedVolunteers.value.data;
  const stillAvailable = availableVolunteers.value.data;
  const stackedAvailable = assigned.map((assignedCount, index) => {
    const stillAvailableCount = stillAvailable.at(index) ?? 0;
    return assignedCount + stillAvailableCount;
  });
  const demands = requestedVolunteers.value.data;

  const maxVolunteers = Math.max(...demands, ...stackedAvailable);
  const steps = Math.ceil((maxVolunteers * TOP_MARGING) / STEP);
  return steps * STEP;
});

const options = computed(() => {
  const textColor = theme.global.current.value.colors["on-surface"];
  const gridColor = hexToRGBA(textColor, 0.1);

  return {
    responsive: true,
    aspectRatio: 3,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20,
          minRotation: 60,
          font: { size: 10 },
          color: textColor,
        },
        grid: { color: gridColor },
      },
      yStacked: {
        beginAtZero: true,
        min: 0,
        max: max.value,
        stacked: true,
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      yRequested: {
        beginAtZero: true,
        stacked: false,
        min: 0,
        max: max.value,
        ticks: { display: false },
        border: { display: false },
        grid: { display: false, drawTicks: false },
      },
    },
    onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
      const [first] = elements;
      if (!first) return;
      emit("select:details", first.index);
    },
    plugins: {
      tooltip: { mode: "index" },
      legend: {
        labels: { usePointStyle: true, color: textColor },
        onHover: (event: ChartEvent) => {
          (event?.native?.target as HTMLElement).style.cursor = "pointer";
        },
        onLeave: (event: ChartEvent) => {
          (event?.native?.target as HTMLElement).style.cursor = "default";
        },
      },
    },
  } as const;
});
</script>

<style scoped>
.chart {
  padding: 15px;
}
</style>
