<template>
  <v-data-table
    :headers="headers"
    :items="timeWindows"
    item-key="key"
    :items-per-page="-1"
    hide-default-footer
    :custom-sort="sortTimeWindows"
  >
    <template #item.start="{ item }">
      {{ formatDate(item.start) }}
    </template>

    <template #item.end="{ item }">
      {{ formatDate(item.end) }}
    </template>

    <template #item.actions="{ item }">
      <div v-if="!disabled">
        <v-btn icon @click="updateTimeWindow(item)">
          <v-icon>mdi-clock-edit</v-icon>
        </v-btn>

        <v-btn icon @click="deleteTimeWindow(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
    <template #no-data> Aucun créneau ajouté </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import {
  SortableFaTimeWindowHeader,
  faTimeWindowsSorts,
} from "~/utils/functions/time-window";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";

export default Vue.extend({
  name: "FaTimeWindowTable",
  props: {
    timeWindows: {
      type: Array as () => TimeWindow[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    headers: [
      { text: "Date de début", value: "start" },
      { text: "Date de fin", value: "end" },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
  },
  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
    addTimeWindow(period: IProvidePeriod) {
      this.$emit("add", period);
    },
    updateTimeWindow(timeWindow: TimeWindow) {
      this.$emit("update", timeWindow);
    },
    deleteTimeWindow(timeWindow: TimeWindow) {
      this.$emit("delete", timeWindow);
    },
    sortTimeWindows(
      timeWindows: TimeWindow[],
      sortsBy: SortableFaTimeWindowHeader[],
      sortsDesc: boolean[],
    ) {
      const sortBy = sortsBy.at(0) ?? "start";
      const sortFnc = faTimeWindowsSorts.get(sortBy);

      if (!sortFnc) return timeWindows;

      const sortDesc = sortsDesc.at(0) ?? false;
      return sortFnc(timeWindows, sortDesc);
    },
  },
});
</script>
