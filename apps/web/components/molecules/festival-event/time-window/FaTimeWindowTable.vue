<template>
  <div class="time-windows__listing">
    <v-data-table
      :headers="dataTableHeaders"
      :items="timeWindows"
      item-key="key"
      :items-per-page="-1"
      hide-default-footer
      dense
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
      <PeriodForm @add="addTimeWindow" @close-dialog="closeAddDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PeriodForm from "~/components/molecules/period/PeriodForm.vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import {
  SortablePeriodHeader,
  periodsSorts,
} from "~/utils/functions/sort-period";
import { FestivalActivity, TimeWindow } from "@overbookd/festival-event";
import { Header } from "~/utils/models/data-table.model";
import { IProvidePeriod } from "@overbookd/period";

type FaTimeWindowTableData = {
  headers: Header[];
  actionHeader: Header;
  isAddDialogOpen: boolean;
};

export default defineComponent({
  name: "FaTimeWindowTable",
  components: { PeriodForm },
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
  emits: ["add", "remove"],
  data: (): FaTimeWindowTableData => ({
    headers: [
      { text: "Date de début", value: "start" },
      { text: "Date de fin", value: "end" },
    ],
    actionHeader: {
      text: "Actions",
      value: "actions",
      sortable: false,
    },
    isAddDialogOpen: false,
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    dataTableHeaders(): Header[] {
      return this.disabled
        ? this.headers
        : [...this.headers, this.actionHeader];
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
      sortsBy: SortablePeriodHeader[],
      sortsDesc: boolean[],
    ) {
      const sortBy = sortsBy.at(0) ?? "start";
      const sortFnc = periodsSorts.get(sortBy);

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
