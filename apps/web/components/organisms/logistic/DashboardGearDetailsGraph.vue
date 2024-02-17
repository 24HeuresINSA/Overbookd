<template>
  <div>
    <client-only>
      <LineChart :data="courbs" :options="options" />
    </client-only>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GearDetails, GearDetailsInquiry } from "@overbookd/http";
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
  name: "DashboardGearDetailsGraph",
  emits: ["select:gear-details"],
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
        onClick: (_event: unknown, elements: { _index: number }[]) => {
          const [first] = elements;
          if (!first) return;
          this.$emit("select:gear-details", first._index);
        },
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
    const { inventory, activities, tasks } = allDetails[tooltipItem.index];

    const isStock = tooltipItem.datasetIndex === 0;
    if (isStock) {
      return inventory > 0 ? `Inventaire: ${inventory}\n` : "";
    }

    const isInquiry = tooltipItem.datasetIndex === 1;
    if (isInquiry) {
      const faDetails = listInquirySources({
        title: "FA",
        sources: activities,
      });
      const ftDetails = listInquirySources({
        title: "FT",
        sources: tasks,
      });
      const sourceDetails = [faDetails, ftDetails].filter(
        (details) => details !== "",
      );

      return sourceDetails.join("\n");
    }
  };
}

function tooltipLabel(tooltipItem: Tooltip, data: ChartData) {
  const datasetLabel = data.datasets[tooltipItem.datasetIndex].label || "";
  const dataPoint = tooltipItem.yLabel;
  return `${datasetLabel}: ${dataPoint}`;
}

function listInquirySources({
  title,
  sources,
}: {
  title: string;
  sources: GearDetailsInquiry[];
}): string {
  if (sources.length === 0) return "";
  const bullet = "•";
  const sourceListing = sources.map(
    ({ id, name, quantity }) => `${bullet} #${id}-${name}: ${quantity}`,
  );
  return [title, ...sourceListing].join("\n");
}
</script>
