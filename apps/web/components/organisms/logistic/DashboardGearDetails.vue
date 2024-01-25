<template>
  <v-data-table :items="details" :headers="headers">
    <template #item.start="{ item }">
      {{ formatDateWithMinutes(item.start) }}
    </template>
    <template #item.end="{ item }">
      {{ formatDateWithMinutes(item.end) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { GearDetails } from "@overbookd/http";
import { defineComponent } from "vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";

export default defineComponent({
  name: "DashboardGearDetails",
  computed: {
    headers() {
      return [
        { text: "Début", value: "start" },
        { text: "Fin", value: "end" },
        { text: "Cumul", value: "inquiry" },
        { text: "Stock total", value: "stock" },
        { text: "Activités", value: "activities" },
        { text: "Inventaire", value: "inventory" },
      ];
    },
    details(): GearDetails[] {
      const selectedGear = this.$accessor.logisticDashboard.selectedGear;
      if (!selectedGear) return [];
      return selectedGear.details;
    },
  },
  methods: {
    formatDateWithMinutes,
  },
});
</script>
