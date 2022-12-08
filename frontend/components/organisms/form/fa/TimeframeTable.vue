<template>
  <div>
    <v-card :class="validationStatus">
      <v-card-title>Créneaux</v-card-title>

      <v-data-table
        :headers="headers"
        :items="timeWindowsList"
        dense
        :items-per-page="-1"
        sort-by="dateStart"
      >
        <template #[`item.dateStart`]="{ item }">
          {{ formatDate(item.start) }}
        </template>
        <template #[`item.timeStart`]="{ item }">
          {{ formatTime(item.start) }}
        </template>
        <template #[`item.dateEnd`]="{ item }">
          {{ formatDate(item.end) }}
        </template>
        <template #[`item.timeEnd`]="{ item }">
          {{ formatTime(item.end) }}
        </template>
        <template #[`item.action`]="{ index, item }">
          <div v-if="isAnimationTimeWindow(item)">
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="openUpdateModal(index, item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="deleteTimeframe(index)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!isValidatedByOwner" text @click="isAddDialogOpen = true"
          >Ajouter un créneau</v-btn
        >
      </v-card-actions>

      <TimeframeCalendar></TimeframeCalendar>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <TimeframeForm
        :type="type"
        @change="addTimeWindow"
        @close-dialog="isAddDialogOpen = false"
      ></TimeframeForm>
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <TimeframeForm
        v-model="selectedTimeWindow"
        @change="updateTimeWindow"
        @close-dialog="isEditDialogOpen = false"
      ></TimeframeForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeframeCalendar from "~/components/molecules/timeframe/TimeframeCalendar.vue";
import TimeframeForm from "~/components/molecules/timeframe/TimeframeForm.vue";
import { FA, Status, time_windows, time_windows_type } from "~/utils/models/FA";
import {
  isAnimationValidatedBy,
  getFAValidationStatus,
} from "~/utils/rules/faValidationRules";

export default Vue.extend({
  name: "TimeframeTable",
  components: { TimeframeCalendar, TimeframeForm },
  data: () => ({
    owner: "humain",
    headers: [
      { text: "Type", value: "type" },
      { text: "Date de début", value: "dateStart" },
      { text: "Heure de début", value: "timeStart" },
      { text: "Date de fin", value: "dateEnd" },
      { text: "Heure de fin", value: "timeEnd" },
      { text: "Action", value: "action" },
    ],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    editIndex: null as number | null,
    selectedTimeWindow: null as time_windows | null,
  }),
  computed: {
    timeWindowsList(): time_windows[] {
      return this.$accessor.FA.timeWindows;
    },
    type() {
      return time_windows_type.ANIM;
    },
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): Status {
      return getFAValidationStatus(this.mFA, this.owner);
    },
  },
  methods: {
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    },
    formatTime(date: string): string {
      return new Date(date).toLocaleTimeString("fr-FR", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    async deleteTimeframe(index: number) {
      await this.$accessor.FA.deleteTimeWindow(index);
    },
    addTimeWindow(timeWindow: time_windows) {
      this.$accessor.FA.addTimeWindow(timeWindow);
    },
    updateTimeWindow(timeWindow: time_windows) {
      this.$accessor.FA.updateTimeWindow({
        index: this.editIndex,
        timeWindow,
      });
    },
    openUpdateModal(index: number, timeWindow: time_windows) {
      this.editIndex = index;
      this.selectedTimeWindow = timeWindow;
      this.isEditDialogOpen = true;
    },
    isAnimationTimeWindow(timeWindow: time_windows): boolean {
      return timeWindow.type === time_windows_type.ANIM;
    },
  },
});
</script>
