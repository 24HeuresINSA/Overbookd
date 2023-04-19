<template>
  <div>
    <client-only>
      <LineChart :data="courbs" :options="options" />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { OrgaNeedsResponse } from "~/store/orgaNeeds";

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

export default Vue.extend({
  name: "OrgaNeedsChart",
  data() {
    return {
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
    };
  },
  computed: {
    stats(): OrgaNeedsResponse[] {
      return this.$accessor.orgaNeeds.stats;
    },
  },
  watch: {
    stats() {
      this.courbs = {
        labels: this.labels(),
        datasets: [
          this.availableVolunteers(),
          this.requestedVolunteers(),
          this.assignedVolunteers(),
        ],
      };
    },
  },
  methods: {
    labels(): string[] {
      return this.stats.map((stat) => stat.start.toLocaleString());
    },
    availableVolunteers(): Dataset {
      return {
        label: "Bénevoles disponibles",
        data: this.stats.map((stat) => stat.availableVolunteers),
        backgroundColor: "#00ff0030",
        borderColor: "#00ff00",
        ...this.datasetOptions,
      };
    },
    requestedVolunteers(): Dataset {
      return {
        label: "Bénevoles demandés",
        data: this.stats.map((stat) => stat.requestedVolunteers),
        backgroundColor: "#ff000030",
        borderColor: "#ff0000",
        ...this.datasetOptions,
      };
    },
    assignedVolunteers(): Dataset {
      return {
        label: "Bénevoles assignés",
        data: this.stats.map((stat) => stat.assignedVolunteers),
        backgroundColor: "#0000ff30",
        borderColor: "#0000ff",
        ...this.datasetOptions,
      };
    },
  },
});
</script>
