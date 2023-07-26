<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title>Créneaux</v-card-title>

      <v-card-text>
        <FATimeWindowTable
          :disabled="isValidatedByOwners"
          @update="openEditDialog"
          @delete="deleteTimeWindow"
        ></FATimeWindowTable>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!isValidatedByOwners" text @click="openAddDialog">
          Ajouter un créneau
        </v-btn>
      </v-card-actions>

      <FestivalEventCalendar />
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <FATimeWindowForm
        @change="addTimeWindow"
        @close-dialog="closeTimeWindowDialog"
      ></FATimeWindowForm>
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <FATimeWindowForm
        :time-window="selectedTimeWindow"
        @change="updateTimeWindow"
        @close-dialog="closeTimeWindowDialog"
      ></FATimeWindowForm>
    </v-dialog>

    <v-dialog v-model="isConfirmationDialogOpen" max-width="600">
      <ConfirmationMessage
        @close-dialog="isConfirmationDialogOpen = false"
        @confirm="resetLogValidations"
      >
        <template #title> Suppression du créneau MATOS </template>
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
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import FATimeWindowForm from "~/components/molecules/festivalEvent/timeWindow/FATimeWindowForm.vue";
import FATimeWindowTable from "~/components/molecules/festivalEvent/timeWindow/FATimeWindowTable.vue";
import FestivalEventCalendar from "~/components/molecules/festivalEvent/timeWindow/FestivalEventCalendar.vue";
import CardErrorList from "~/components/molecules/festivalEvent/validation/CardErrorList.vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import {
  getFAValidationStatusWithMultipleTeams,
  hasAllValidations,
  hasAtLeastOneValidation,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import {
  Fa,
  FaCardType,
  FaTimeWindowWithType,
  TimeWindowType,
} from "~/utils/models/fa";
import { Period } from "~/utils/models/gearRequests";
import { MyUserInformation, User } from "~/utils/models/user";

interface IdentifiableTimeWindow extends FaTimeWindowWithType {
  key: string;
}

export default Vue.extend({
  name: "FATimeWindowCard",
  components: {
    FATimeWindowTable,
    FestivalEventCalendar,
    FATimeWindowForm,
    CardErrorList,
    ConfirmationMessage,
  },
  data: () => ({
    animOwner: "humain",
    matosOwners: ["matos", "barrieres", "elec"],
    cardType: FaCardType.TIME_WINDOW,
    headers: [
      { text: "Type", value: "type" },
      { text: "Date de début", value: "start" },
      { text: "Date de fin", value: "end" },
      { text: "Action", value: "action" },
    ],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isConfirmationDialogOpen: false,

    selectedTimeWindow: null as IdentifiableTimeWindow | null,
  }),
  computed: {
    timeWindowsList(): IdentifiableTimeWindow[] {
      const animationTimeWindows = this.$accessor.fa.mFA.timeWindows?.map(
        (period, index) => {
          return this.convertToIdentifiableTimeWindow(
            { ...period, type: TimeWindowType.ANIM },
            index
          );
        }
      );

      const gearTimeWindows = this.$accessor.fa.gearRequestRentalPeriods.map(
        (period, index) => {
          return this.convertToIdentifiableTimeWindow(
            { ...period, type: TimeWindowType.MATOS },
            index
          );
        }
      );

      return [...animationTimeWindows, ...gearTimeWindows];
    },
    mFA(): Fa {
      return this.$accessor.fa.mFA;
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
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
  },
  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
    confirmToDeleteTimeframe(timeWindow: IdentifiableTimeWindow) {
      const isMatosTimeframe = timeWindow.type === TimeWindowType.MATOS;
      const shouldAskConfirmation =
        isMatosTimeframe && hasAtLeastOneValidation(this.mFA, this.matosOwners);
      this.selectedTimeWindow = timeWindow;

      if (!shouldAskConfirmation) return this.deleteTimeframe();
      this.openConfirmationDialog();
    },
    resetLogValidations() {
      const author: User = {
        id: this.me.id,
        firstname: this.me.firstname,
        lastname: this.me.lastname,
      };
      this.$accessor.fa.resetLogValidations(author);
      this.deleteTimeframe();
    },
    deleteTimeframe() {
      if (this.selectedTimeWindow?.type === TimeWindowType.ANIM) {
        const index = this.retrieveAnimationTimeWindowIndex(
          this.selectedTimeWindow
        );
        return this.$accessor.fa.deleteTimeWindow(index);
      }
      return this.$accessor.fa.removeGearRequestRentalPeriod(
        this.selectedTimeWindow as Period
      );
    },
    addTimeWindow(timeWindow: FaTimeWindowWithType) {
      if (timeWindow.type === TimeWindowType.ANIM) {
        return this.$accessor.fa.addTimeWindow(timeWindow);
      }
      this.$accessor.fa.addGearRequestRentalPeriod(timeWindow);
    },
    updateTimeWindow(timeWindow: FaTimeWindowWithType) {
      if (timeWindow.type === TimeWindowType.ANIM) {
        return this.updateAnimationTimeWindow(timeWindow);
      }
      if (!timeWindow.id) return;
      this.$accessor.fa.updateGearPeriod(timeWindow as Period);
    },
    deleteTimeWindow(timeWindow: IdentifiableTimeWindow) {
      if (timeWindow.type === TimeWindowType.ANIM) {
        const index = this.retrieveAnimationTimeWindowIndex(timeWindow);
        return this.$accessor.fa.deleteTimeWindow(index);
      }
      return this.$accessor.fa.removeGearRequestRentalPeriod(
        timeWindow as Period
      );
    },
    retrieveAnimationTimeWindowIndex(timeWindow: IdentifiableTimeWindow) {
      return timeWindow.id
        ? this.findAnimationTimeWindowIndexByIdAndType(timeWindow.id)
        : this.destructTimeWindowKeyToFindIndex(timeWindow!);
    },
    updateAnimationTimeWindow(timeWindow: FaTimeWindowWithType) {
      this.$accessor.fa.updateTimeWindow(timeWindow);
    },
    findAnimationTimeWindowIndexByIdAndType(timeWindowId: number): number {
      return this.$accessor.fa.mFA.timeWindows!.findIndex(
        (tw) => tw.id === timeWindowId
      );
    },
    destructTimeWindowKeyToFindIndex(
      timeWindow: IdentifiableTimeWindow
    ): number {
      return parseInt(timeWindow.key.split("_")[1]);
    },
    openEditDialog(timeWindow: IdentifiableTimeWindow) {
      this.selectedTimeWindow = timeWindow;
      this.isEditDialogOpen = true;
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeTimeWindowDialog() {
      this.isAddDialogOpen = false;
      this.isEditDialogOpen = false;
    },
    openConfirmationDialog() {
      this.isConfirmationDialogOpen = true;
    },
    closeConfirmationDialog() {
      this.isConfirmationDialogOpen = false;
    },
    isAnimationTimeWindow(timeWindow: FaTimeWindowWithType): boolean {
      return timeWindow.type === TimeWindowType.ANIM;
    },
    convertToIdentifiableTimeWindow(
      timeWindow: FaTimeWindowWithType,
      defaultId: number
    ): IdentifiableTimeWindow {
      return {
        ...timeWindow,
        key: `${timeWindow.type}_${timeWindow.id ?? defaultId}`,
      };
    },
    isEditable(timeWindow: IdentifiableTimeWindow) {
      if (timeWindow.type === TimeWindowType.ANIM) {
        return !this.isValidatedByAnimOwner;
      }
      return !this.isValidatedByMatosOwners;
    },
  },
});
</script>
