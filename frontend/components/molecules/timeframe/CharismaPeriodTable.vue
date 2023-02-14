<template>
  <v-data-table
    :headers="headers"
    :items="charismaPeriods"
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
    <template #no-data> Aucun créneau ajouté </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { SavedCharismaPeriod } from "~/utils/models/charismaPeriod";

export default Vue.extend({
  name: "CharismaPeriodTable",
  data: () => ({
    headers: [
      { text: "Début", value: "start" },
      { text: "Fin", value: "end" },
      { text: "Charisme/h", value: "charisma" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  computed: {
    charismaPeriods(): SavedCharismaPeriod[] {
      return this.$accessor.charismaPeriod.charismaPeriods;
    },
  },
  methods: {
    updateAvailability(charismaPeriod: SavedCharismaPeriod) {
      this.$emit("update", charismaPeriod);
    },
    deleteAvailability(charismaPeriod: SavedCharismaPeriod) {
      this.$emit("delete", charismaPeriod);
    },
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
  },
});
</script>
