<template>
  <div>
    <client-only>
      <LineChart :data="courbs" :options="options" />
    </client-only>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GearDetails } from "@overbookd/http";
import { formatDateWithMinutes } from "~/utils/date/date.utils";

type Dataset = {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  pointRadius: number;
  pointHitRadius: number;
};

type ChartData = {
  labels: string[];
  datasets: Dataset[];
};

type Tooltip = {
  datasetIndex: number;
  yLabel: number;
  index: number;
};

type DashboardGearDetailsData = {
  courbs: ChartData;
  datasetOptions: {
    borderWidth: number;
    pointRadius: number;
    pointHitRadius: number;
  };
};

export default defineComponent({
  name: "DashboardGearDetails",
  data: (): DashboardGearDetailsData => ({
    courbs: {
      labels: [],
      datasets: [],
    },
    datasetOptions: {
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
    },
  }),
  computed: {
    details(): GearDetails[] {
      const selectedGear = this.$accessor.logisticDashboard.selectedGear;
      if (!selectedGear) return [];
      return selectedGear.details;
    },
    labels(): string[] {
      return this.details.map((stat) => formatDateWithMinutes(stat.start));
    },
    stock(): Dataset {
      return {
        label: "Stock",
        data: this.details.map((stat) => stat.stock),
        backgroundColor: "#00ff0030",
        borderColor: "#00ff00",
        ...this.datasetOptions,
      };
    },
    inquiries(): Dataset {
      return {
        label: "Demandes",
        data: this.details.map((stat) => stat.inquiry),
        backgroundColor: "#ff000030",
        borderColor: "#ff0000",
        ...this.datasetOptions,
      };
    },
    options(): unknown {
      const allDetails = this.details;

      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 20 } }] },
        hover: { mode: "nearest", intersect: true },
        tooltips: {
          mode: "index",
          position: "nearest",
          callbacks: {
            label: tooltipLabel,
            afterLabel: listStockAndInquiriesSources(allDetails),
          },
        },
      };
    },
  },
  watch: {
    details() {
      this.courbs = {
        labels: this.labels,
        datasets: [this.stock, this.inquiries],
      };
    },
  },
});

function listStockAndInquiriesSources(allDetails: GearDetails[]) {
  return function (tooltipItem: Tooltip) {
    const details = allDetails[tooltipItem.index];
    const bullet = "•";

    const isStock = tooltipItem.datasetIndex === 0;
    if (isStock) {
      return details.inventory > 0 ? `Inventaire: ${details.inventory}\n` : "";
    }

    const isInquiry = tooltipItem.datasetIndex === 1;
    if (isInquiry) {
      const faTitle = "FA:\n";
      const faContent = details.activities
        .map(
          ({ id, name, quantity }) => `${bullet} #${id}-${name}: ${quantity}`,
        )
        .join("\n");
      return details.activities.length > 0 ? `${faTitle}${faContent}` : "";
    }
  };
}

function tooltipLabel(tooltipItem: Tooltip, data: ChartData) {
  const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || "";
  const dataPoint = tooltipItem.yLabel;
  return `${datasetLabel}: ${dataPoint}`;
}
</script>
