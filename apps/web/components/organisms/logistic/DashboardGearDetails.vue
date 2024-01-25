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
};

export default defineComponent({
  name: "DashboardGearDetails",
  data: () => ({
    courbs: {
      labels: [],
      datasets: [],
    } as ChartData,
    datasetOptions: {
      borderWidth: 2,
      pointRadius: 0,
      pointHitRadius: 10,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              autoSkip: true,
              maxTicksLimit: 20,
            },
          },
        ],
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      tooltips: {
        mode: "index",
        position: "nearest",
        callbacks: {
          label: function (tooltipItem: Tooltip, data: ChartData) {
            const datasetLabel =
              data.datasets[tooltipItem.datasetIndex].label || "";
            const dataPoint = tooltipItem.yLabel;
            return `${datasetLabel}: ${dataPoint}`;
          },
        },
      },
    },
  }),
  computed: {
    details(): GearDetails[] {
      const selectedGear = this.$accessor.logisticDashboard.selectedGear;
      if (!selectedGear) return [];
      return selectedGear.details;
    },
    labels(): string[] {
      return this.details.map((stat) => stat.start.toLocaleString());
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
</script>
