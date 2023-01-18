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
            <v-btn v-if="isEditable(item)" icon @click="openUpdateModal(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              v-if="isEditable(item)"
              icon
              @click="confirmToDeleteTimeframe(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!isValidatedByOwners" text @click="isAddDialogOpen = true"
          >Ajouter un créneau</v-btn
        >
      </v-card-actions>

      <FestivalEventCalendar :time-windows="timeWindowsList" />
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
    <v-dialog v-model="isConfirmationDialogOpen" max-width="600px">
      <ConfirmationMessage
        @close-dialog="isConfirmationDialogOpen = false"
        @confirm="resetLogValidations"
      >
        <template #title> Suppression ce créneau MATOS </template>
        <template #statement>
          Confirmer cette suppression annulera les validations des orgas Matos,
          Barrieres et Elec 😠
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FestivalEventCalendar from "~/components/molecules/timeframe/FestivalEventCalendar.vue";
import TimeframeForm from "~/components/molecules/timeframe/TimeframeForm.vue";
import {
  getFAValidationStatusWithMultipleTeams,
  isAnimationValidatedBy,
  hasAtLeastOneValidation,
  hasAllValidations,
} from "~/utils/fa/faUtils";
import {
  FA,
  Period,
  fa_card_type,
  time_windows,
  time_windows_type,
} from "~/utils/models/FA";
import CardErrorList from "~/components/molecules/CardErrorList.vue";
import ConfirmationMessage from "~/components/atoms/ConfirmationMessage.vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";

interface IdentifiableTimeWindow extends time_windows {
  key: string;
}

export default Vue.extend({
  name: "TimeframeTable",
  components: {
    FestivalEventCalendar,
    TimeframeForm,
    CardErrorList,
    ConfirmationMessage,
  },
  data: () => ({
    animOwner: "humain",
    matosOwners: ["matos", "barrieres", "elec"],
    cardType: fa_card_type.TIME_WINDOW,
    headers: [
      { text: "Type", value: "type" },
      { text: "Date de début", value: "startDate" },
      { text: "Date de fin", value: "endDate" },
      { text: "Action", value: "action" },
    ],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isConfirmationDialogOpen: false,

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
    isValidatedByAnimOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.animOwner);
    },
    isValidatedByMatosOwners(): boolean {
      return hasAllValidations(this.mFA, this.matosOwners);
    },
    isValidatedByOwners(): boolean {
      return this.isValidatedByAnimOwner && this.isValidatedByMatosOwners;
    },
    validationStatus(): string {
      const owners = [...this.matosOwners, this.animOwner];
      return getFAValidationStatusWithMultipleTeams(
        this.mFA,
        owners
      ).toLowerCase();
    },
    me(): any {
      return this.$accessor.user.me;
    },
  },
  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
    confirmToDeleteTimeframe(timeWindow: IdentifiableTimeWindow) {
      const isMatosTimeframe = timeWindow.type === time_windows_type.MATOS;
      const shouldAskConfirmation =
        isMatosTimeframe && hasAtLeastOneValidation(this.mFA, this.matosOwners);
      this.selectedTimeWindow = timeWindow;

      if (!shouldAskConfirmation) return this.deleteTimeframe();
      this.isConfirmationDialogOpen = true;
    },
    resetLogValidations() {
      this.$accessor.FA.resetLogValidations({ author: this.me });
      this.deleteTimeframe();
    },
    deleteTimeframe() {
      if (this.selectedTimeWindow?.type === time_windows_type.ANIM) {
        const index = this.retrieveAnimationTimeWindowIndex(
          this.selectedTimeWindow
        );
        return this.$accessor.FA.deleteTimeWindow(index);
      }
      return this.$accessor.FA.removeGearRequestRentalPeriod(
        this.selectedTimeWindow as Period
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
    deleteTimeWindow(timeWindow: IdentifiableTimeWindow) {
      if (timeWindow.type === time_windows_type.ANIM) {
        const index = this.retrieveAnimationTimeWindowIndex(timeWindow);
        return this.$accessor.FA.deleteTimeWindow(index);
      }
      return this.$accessor.FA.removeGearRequestRentalPeriod(
        timeWindow as Period
      );
    },
    retrieveAnimationTimeWindowIndex(timeWindow: IdentifiableTimeWindow) {
      return timeWindow.id
        ? this.findTimeWindowIndexByIdAndType(timeWindow.id, timeWindow.type)
        : this.destructTimeWindowKeyToFindIndex(timeWindow!);
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
    destructTimeWindowKeyToFindIndex(
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
    isEditable(timeWindow: IdentifiableTimeWindow) {
      if (timeWindow.type === time_windows_type.ANIM) {
        return !this.isValidatedByAnimOwner;
      }
      return !this.isValidatedByMatosOwners;
    },
  },
});
</script>
