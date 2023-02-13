<template>
  <v-data-table :headers="headers">
    <template #item.start="{ item }">
      {{ formatDate(item.start) }}
    </template>
    <template #item.end="{ item }">
      {{ formatDate(item.end) }}
    </template>
    <template #item.action="{ item }">
      <v-btn icon @click="updateAvailability(item)">
        <v-icon>mdi-clock-edit</v-icon>
      </v-btn>
      <v-btn icon @click="deleteAvailability(item)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
    <template #no-data> Aucune disponibilité ajoutée </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "AvailabilitiesCreationTable",
  data: () => ({
    headers: [
      { text: "Début", value: "start" },
      { text: "Fin", value: "end" },
      { text: "Charisme", value: "charisma" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  methods: {
    updateAvailability(availability: any) {
      this.$emit("update", availability);
    },
    deleteAvailability(availability: any) {
      this.$emit("delete", availability);
    },
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
  },
});
</script>
