<template>
  <div>
    <client-only>
      <LineChart :data="courbs" :options="options" />
    </client-only>
  </div>
</template>

<script lang="ts">
import { OrgaNeedDetails } from "@overbookd/http";
import { defineComponent } from "vue";
import { ChartData, Dataset, tooltipLabel } from "~/utils/graph/graph";

export default defineComponent({
  name: "OrgaNeedsChart",
  emits: ["select:orga-needs-details"],
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
    };
  },
  computed: {
    stats(): OrgaNeedDetails[] {
      return this.$accessor.orgaNeeds.stats;
    },
    max(): number {
      const TOP_MARGING = 1.05;
      const STEP = 50;

      const assigned = this.assignedVolunteers().data;
      const stillAvailable = this.availableVolunteers().data;
      const stackedAvailable = assigned.map((assignedCount, index) => {
        const stillAvailableCount = stillAvailable.at(index) ?? 0;
        return assignedCount + stillAvailableCount;
      });
      const demands = this.requestedVolunteers().data;

      const maxVolunteers = Math.max(...demands, ...stackedAvailable);
      const steps = Math.ceil((maxVolunteers * TOP_MARGING) / STEP);
      return steps * STEP;
    },
    options(): unknown {
      return {
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
          yAxes: [
            {
              id: "availability",
              stacked: true,
              ticks: { max: this.max },
              position: "right",
            },
            { id: "demands", stacked: false, ticks: { min: 0, max: this.max } },
          ],
        },
        hover: {
          mode: "nearest",
          intersect: true,
        },
        onHover(event, chartElement) {
          event.target.style.cursor = chartElement[0] ? "pointer" : "default";
        },
        onClick: (_event: unknown, elements: { _index: number }[]) => {
          const [first] = elements;
          if (!first) return;
          this.$emit("select:orga-needs-details", first._index);
        },
        tooltips: {
          mode: "index",
          position: "nearest",
          callbacks: { label: tooltipLabel },
        },
      };
    },
  },
  watch: {
    stats() {
      this.courbs = {
        labels: this.labels(),
        datasets: [
          this.requestedVolunteers(),
          this.assignedVolunteers(),
          this.availableVolunteers(),
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
        yAxisID: "availability",
        ...this.datasetOptions,
      };
    },
    requestedVolunteers(): Dataset {
      return {
        label: "Bénevoles demandés",
        data: this.stats.map((stat) => stat.requestedVolunteers),
        backgroundColor: "#ff000030",
        borderColor: "#ff0000",
        yAxisID: "demands",
        ...this.datasetOptions,
      };
    },
    assignedVolunteers(): Dataset {
      return {
        label: "Bénevoles assignés",
        data: this.stats.map((stat) => stat.assignedVolunteers),
        backgroundColor: "#0000ff30",
        borderColor: "#0000ff",
        yAxisID: "availability",
        ...this.datasetOptions,
      };
    },
  },
});
</script>
