<template>
  <Line :data="courbs" :options="options" />
</template>

<script lang="ts" setup>
import { Line } from "vue-chartjs";
import type { GearDetails, GearWithDetails } from "@overbookd/http";
import { formatDateWithMinutes } from "@overbookd/time";
import {
  type ChartData,
  type Dataset,
  tooltipLabel,
} from "~/utils/chartjs-graph";
import {
  isConsumable,
  listStockAndInquiriesSources,
} from "~/utils/logistic/dashboard-graph";
import type { ActiveElement, ChartEvent } from "chart.js";

const dashboardStore = useLogisticDashboardStore();

const DATASET_OPTIONS = {
  borderWidth: 2,
  pointRadius: 0,
  pointHitRadius: 10,
};

const courbs = ref<ChartData>({
  labels: [],
  datasets: [],
});

const stock = computed<Dataset>(() => ({
  label: "Stock",
  data: details.value.map((stat) => stat.stock),
  backgroundColor: "#00ff0030",
  borderColor: "#00ff00",
  ...DATASET_OPTIONS,
}));
const inquiries = computed<Dataset>(() => ({
  label: "Demandes",
  data: details.value.map((stat) => stat.inquiry),
  backgroundColor: "#ff000030",
  borderColor: "#ff0000",
  ...DATASET_OPTIONS,
}));
const consumed = computed<Dataset>(() => {
  const data = isConsumable(details.value)
    ? details.value.map((stat) => stat.consumed)
    : [];
  return {
    label: "Consommés",
    data,
    backgroundColor: "#0000ff30",
    borderColor: "#0000ff",
    ...DATASET_OPTIONS,
  };
});

const emit = defineEmits(["select:gear-details"]);

const selectedGear = computed<GearWithDetails | undefined>(
  () => dashboardStore.selectedGear,
);
const details = computed<GearDetails[]>(
  () => selectedGear.value?.details ?? [],
);
const labels = computed(() =>
  details.value.map((stat) => formatDateWithMinutes(stat.start)),
);

const options = computed(
  () =>
    ({
      responsive: true,
      aspectRatio: 3,
      plugins: {
        legend: {
          onHover: (event: ChartEvent) => {
            (event?.native?.target as HTMLElement).style.cursor = "pointer";
          },
          onLeave: (event: ChartEvent) => {
            (event?.native?.target as HTMLElement).style.cursor = "default";
          },
        },
        tooltips: {
          mode: "index",
          position: "nearest",
          callbacks: {
            label: tooltipLabel,
            afterLabel: listStockAndInquiriesSources(details.value),
          },
        },
      },
      onClick: (_event: ChartEvent, elements: ActiveElement[]) => {
        const [first] = elements;
        if (!first) return;
        emit("select:gear-details", first.index);
      },
      onHover: (event: ChartEvent) => {
        (event?.native?.target as HTMLElement).style.cursor = "pointer";
      },
    }) as const,
);

watch(details, () => {
  const defaultDatasets = [stock.value, inquiries.value];
  const datasets = isConsumable(details.value)
    ? [...defaultDatasets, consumed.value]
    : defaultDatasets;

  courbs.value = {
    labels: labels.value,
    datasets,
  };
});
</script>
