<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title>Créneaux</v-card-title>

      <v-data-table
        :headers="headers"
        :items="timeWindowsList"
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
        <template #[`item.action`]="{ item }">
          <div>
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="openUpdateModal(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="!isValidatedByOwner"
              icon
              @click="deleteTimeframe(item)"
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

      <TimeframeCalendar :timeframes="timeWindowsList"></TimeframeCalendar>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <TimeframeForm
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
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import { hasTimeWindowsErrors } from "~/utils/rules/faValidationRules";
import {
  FA,
  Period,
  fa_card_type,
  time_windows,
  time_windows_type,
} from "~/utils/models/FA";
import CardErrorList from "~/components/molecules/CardErrorList.vue";

interface IdentifiableTimeWindow extends time_windows {
  key: string;
}

export default Vue.extend({
  name: "TimeframeTable",
  components: { TimeframeCalendar, TimeframeForm, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: fa_card_type.TIME_WINDOW,
    headers: [
      { text: "Type", value: "type" },
      { text: "Date de début", value: "startDate" },
      { text: "Date de fin", value: "endDate" },
      { text: "Action", value: "action" },
    ],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    editIndex: null as number | null,
    selectedTimeWindow: null as IdentifiableTimeWindow | null,
  }),
  computed: {
    timeWindowsList(): IdentifiableTimeWindow[] {
      const animationTimeWindows =
        this.$accessor.FA.mFA.time_windows
          ?.map(this.convertToIdentifiableTimeWindow)
          ?.filter((tw) => tw.type === time_windows_type.ANIM) ?? [];

      const gearTimeWindows = this.$accessor.FA.gearRequestRentalPeriods.map(
        (period, index) => {
          return this.convertToIdentifiableTimeWindow(
            { ...period, type: time_windows_type.MATOS },
            index
          );
        }
      );

      return [...animationTimeWindows, ...gearTimeWindows];
    },
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
    timeWindowsErrors(): string[] {
      return hasTimeWindowsErrors(this.mFA);
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
    deleteTimeframe(timeWindow: IdentifiableTimeWindow) {
      if (timeWindow.type === time_windows_type.ANIM) {
        const index = this.retrieveAnimationTimeWindowIndex(timeWindow);
        return this.$accessor.FA.deleteTimeWindow(index);
      }
      return this.$accessor.FA.removeGearRequestRentalPeriod(
        timeWindow as Period
      );
    },
    addTimeWindow(timeWindow: time_windows) {
      if (timeWindow.type === time_windows_type.ANIM) {
        return this.$accessor.FA.addTimeWindow(timeWindow);
      }
      this.$accessor.FA.addGearRequestRentalPeriod(timeWindow);
    },
    updateTimeWindow(timeWindow: time_windows) {
      if (timeWindow.type === time_windows_type.ANIM) {
        return this.updateAnimationTimeWindow(timeWindow);
      }
      if (!timeWindow.id) return;
      this.$accessor.FA.updateGearPeriod(timeWindow as Period);
    },
    retrieveAnimationTimeWindowIndex(timeWindow: IdentifiableTimeWindow) {
      return timeWindow.id
        ? this.findTimeWindowIndexByIdAndType(timeWindow.id, timeWindow.type)
        : this.desctructTimeWindowKeyToFindIndex(timeWindow!);
    },
    updateAnimationTimeWindow(timeWindow: time_windows) {
      if (!this.selectedTimeWindow) return;
      const index = this.retrieveAnimationTimeWindowIndex(
        this.selectedTimeWindow
      );
      this.$accessor.FA.updateTimeWindow({
        index,
        timeWindow,
      });
    },
    findTimeWindowIndexByIdAndType(
      timeWindowId: number,
      timeWindowType: time_windows_type
    ): number {
      return this.$accessor.FA.mFA.time_windows!.findIndex(
        (tw) => tw.id === timeWindowId && tw.type === timeWindowType
      );
    },
    desctructTimeWindowKeyToFindIndex(
      timeWindow: IdentifiableTimeWindow
    ): number {
      return parseInt(timeWindow.key.split("_")[1]);
    },
    openUpdateModal(timeWindow: IdentifiableTimeWindow) {
      this.selectedTimeWindow = timeWindow;
      this.isEditDialogOpen = true;
    },
    isAnimationTimeWindow(timeWindow: time_windows): boolean {
      return timeWindow.type === time_windows_type.ANIM;
    },
    convertToIdentifiableTimeWindow(
      timeWindow: time_windows,
      defaultId: number
    ): IdentifiableTimeWindow {
      return {
        ...timeWindow,
        key: `${timeWindow.type}_${timeWindow.id ?? defaultId}`,
      };
    },
  },
});
</script>
