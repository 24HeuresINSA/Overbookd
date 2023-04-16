<template>
  <div>
    <client-only>
      <LineChart :data="courbs" />
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
};

export default Vue.extend({
  name: "OrgaNeedsChart",
  data() {
    return {
      courbs: {
        labels: [] as string[],
        datasets: [] as Dataset[],
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
      console.log("stats changed");
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
        backgroundColor: "rgba(20, 255, 0, 0.3)",
        borderColor: "rgba(100, 255, 0, 1)",
        borderWidth: 2,
      };
    },
    requestedVolunteers(): Dataset {
      return {
        label: "Bénevoles demandés",
        data: this.stats.map((stat) => stat.requestedVolunteers),
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        borderColor: "rgba(255, 0, 0, 1)",
        borderWidth: 2,
      };
    },
    assignedVolunteers(): Dataset {
      return {
        label: "Bénevoles assignés",
        data: this.stats.map((stat) => stat.assignedVolunteers),
        backgroundColor: "rgba(0, 0, 255, 0.3)",
        borderColor: "rgba(0, 0, 255, 1)",
        borderWidth: 2,
      };
    },
  },
});
</script>
