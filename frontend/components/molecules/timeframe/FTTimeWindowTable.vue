<template>
  <v-data-table
    :headers="headers"
    :items="timeWindows"
    dense
    item-key="key"
    :items-per-page="-1"
    sort-by="dateStart"
  >
    <template #[`item.startDate`]="{ item }">
      {{ formatDate(item.start) }}
    </template>
    <template #[`item.endDate`]="{ item }">
      {{ formatDate(item.end) }}
    </template>
    <template #[`item.action`]="{ index, item }">
      <div>
        <v-btn icon @click="editTimeWindow(index, item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteTimeWindow(index)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { FTTimeWindow } from "~/utils/models/ft";

export default Vue.extend({
  name: "FTTimeWindowTable",
  data: () => ({
    headers: [
      { text: "Date de début", value: "startDate" },
      { text: "Date de fin", value: "endDate" },
      { text: "Découpage", value: "toSlice" },
      { text: "Requis", value: "required" },
      { text: "Affecté", value: "assigned" },
      { text: "Action", value: "action" },
    ],
  }),
  computed: {
    timeWindows(): FTTimeWindow[] {
      return this.$accessor.FT.mFT.timeWindows;
    },
  },
  methods: {
    formatDate(date: string): string {
      const displayOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Intl.DateTimeFormat("fr", displayOptions).format(
        new Date(date)
      );
    },
    editTimeWindow(index: number, timeWindow: FTTimeWindow) {
      this.$emit("update", index, timeWindow);
    },
    deleteTimeWindow(index: number) {
      this.$emit("delete", index);
    },
  },
});
</script>
