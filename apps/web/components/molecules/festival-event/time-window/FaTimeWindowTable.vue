<template>
  <div class="time-windows__listing">
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
        <v-btn v-show="!disabled" icon @click="removeTimeWindow(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </template>
      <template #no-data> Aucun créneau </template>
    </v-data-table>

    <v-btn
      v-show="!disabled"
      color="primary"
      class="time-windows__add"
      @click="openAddDialog"
    >
      Ajouter un créneau
    </v-btn>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <FaTimeWindowFormCard
        @add="addTimeWindow"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FaTimeWindowFormCard from "~/components/molecules/festival-event/time-window/FaTimeWindowFormCard.vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import {
  SortableFaTimeWindowHeader,
  faTimeWindowsSorts,
} from "~/utils/functions/time-window";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-event";
import { Header } from "~/utils/models/data-table.model";
import { IProvidePeriod } from "@overbookd/period";

type FaTimeWindowTableData = {
  headers: Header[];
  isAddDialogOpen: boolean;
};

export default defineComponent({
  name: "FaTimeWindowTable",
  components: { FaTimeWindowFormCard },
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
  data: (): FaTimeWindowTableData => ({
    headers: [
      { text: "Date de début", value: "start" },
      { text: "Date de fin", value: "end" },
      { text: "Actions", value: "actions", sortable: false },
    ],
    isAddDialogOpen: false,
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
    removeTimeWindow(timeWindow: TimeWindow) {
      this.$emit("remove", timeWindow);
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
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.time-windows {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 5px;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
