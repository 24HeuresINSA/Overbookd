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
import { ChartData, Dataset, tooltipLabel } from "~/utils/graph/graph";
import {
  isConsumable,
  listStockAndInquiriesSources,
} from "~/utils/logistic/dashboard-graph";

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
    consumed(): Dataset {
      const data = isConsumable(this.details)
        ? this.details.map((stat) => stat.consumed)
        : [];
      return {
        label: "Consommés",
        data,
        backgroundColor: "#0000ff30",
        borderColor: "#0000ff",
        ...this.datasetOptions,
      };
    },
    options(): unknown {
      const allDetails = this.details;

      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: { xAxes: [{ ticks: { autoSkip: true, maxTicksLimit: 20 } }] },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        onClick: (_event: unknown, elements: { _index: number }[]) => {
          const [first] = elements;
          if (!first) return;
          this.$emit("select:gear-details", first._index);
        },
        onHover(event, chartElement) {
          event.target.style.cursor = chartElement[0] ? "pointer" : "default";
        },
        legend: {
          onHover(event) {
            event.target.style.cursor = "pointer";
          },
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
      const defaultDatasets = [this.stock, this.inquiries];
      const datasets = isConsumable(this.details)
        ? [...defaultDatasets, this.consumed]
        : defaultDatasets;

      this.courbs = {
        labels: this.labels,
        datasets,
      };
    },
  },
});
</script>
