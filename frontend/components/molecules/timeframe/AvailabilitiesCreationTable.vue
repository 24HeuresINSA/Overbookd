<template>
  <v-data-table
    :headers="headers"
    :items="availabilities"
    :items-per-page="-1"
    sort-by="start"
    dense
  >
    <template #item.start="{ item }">
      {{ formatDate(item.start) }}
    </template>
    <template #item.end="{ item }">
      {{ formatDate(item.end) }}
    </template>
    <template #item.actions="{ item }">
      <v-btn icon @click="updateAvailability(item)">
        <v-icon>mdi-pencil</v-icon>
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
      { text: "Charisme/h", value: "charisma" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  computed: {
    availabilities(): any[] {
      // TODO: call store
      return [
        {
          start: new Date("2023-05-12 22:00"),
          end: new Date("2023-05-13 02:00"),
          charisma: 10,
        },
        {
          start: new Date("2023-05-11 00:00"),
          end: new Date("2023-05-12 20:00"),
          charisma: 5,
        },
        {
          start: new Date("2023-05-10 00:00"),
          end: new Date("2023-05-10 20:00"),
          charisma: 1,
        },
      ];
    },
  },
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
