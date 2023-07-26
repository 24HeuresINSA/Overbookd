<template>
  <v-data-table
    :headers="headers"
    :items="timeWindows"
    dense
    item-key="key"
    :items-per-page="-1"
    :custom-sort="sortTimeWindows"
  >
    <template #item.startDate="{ item }">
      {{ formatDate(item.start) }}
    </template>
    <template #item.endDate="{ item }">
      {{ formatDate(item.end) }}
    </template>
    <template #item.action="{ item }">
      <div v-if="!disabled">
        <v-btn icon @click="updateTimeWindow(item)">
          <v-icon>mdi-clock-edit</v-icon>
        </v-btn>
        <v-btn icon @click="deleteTimeWindow(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { SortableTimeWindowHeader } from "~/utils/functions/timeWindow";
import { faTimeWindowsSorts } from "~/utils/functions/timeWindow";
import { Fa, FaTimeWindow } from "~/utils/models/fa";

export default Vue.extend({
  name: "FTTimeWindowTable",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    headers: [
      { text: "Type", value: "type" },
      { text: "Date de début", value: "startDate" },
      { text: "Date de fin", value: "endDate" },
      { text: "Action", value: "action", sortable: false },
    ],
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    timeWindows(): FaTimeWindow[] {
      return this.mFA.timeWindows ?? [];
    },
  },
  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
    updateTimeWindow(timeWindow: FaTimeWindow) {
      this.$emit("update", timeWindow);
    },
    deleteTimeWindow(timeWindow: FaTimeWindow) {
      this.$emit("delete", timeWindow);
    },
    sortTimeWindows(
      timeWindows: FaTimeWindow[],
      sortsBy: SortableTimeWindowHeader[],
      sortsDesc: boolean[]
    ) {
      const sortBy = sortsBy.at(0) ?? "startDate";
      const sortFnc = faTimeWindowsSorts.get(sortBy);

      if (!sortFnc) return timeWindows;

      const sortDesc = sortsDesc.at(0) ?? false;
      return sortFnc(timeWindows, sortDesc);
    },
  },
});
</script>
