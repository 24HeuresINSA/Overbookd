<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title>Créneaux</v-card-title>

      <v-card-text>
        <FaTimeWindowTable
          :time-windows="timeWindowsList"
          :disabled="isValidatedByOwners"
          @update="openEditDialog"
          @delete="deleteTimeWindow"
        ></FaTimeWindowTable>
      </v-card-text>

      <v-card-actions v-if="!isValidatedByOwners">
        <v-spacer></v-spacer>
        <v-btn text @click="openAddDialog"> Ajouter un créneau </v-btn>
      </v-card-actions>

      <FestivalEventCalendar />
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <FaTimeWindowForm
        @change="addTimeWindow"
        @close-dialog="closeTimeWindowDialog"
      ></FaTimeWindowForm>
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <FaTimeWindowForm
        :time-window="selectedTimeWindow"
        @change="updateTimeWindow"
        @close-dialog="closeTimeWindowDialog"
      ></FaTimeWindowForm>
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
import FaTimeWindowForm from "~/components/molecules/festival-event/timeWindow/FaTimeWindowForm.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/timeWindow/FaTimeWindowTable.vue";
import FestivalEventCalendar from "~/components/molecules/festival-event/timeWindow/FestivalEventCalendar.vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import {
  getFAValidationStatusWithMultipleTeams,
  hasAllValidations,
  isAnimationValidatedBy,
} from "~/utils/festival-event/faUtils";
import {
  Fa,
  FaCardType,
  FaTimeWindowWithType,
  TimeWindowType,
} from "~/utils/models/fa";
import { Period } from "~/utils/models/gearRequests";
import { MyUserInformation, User } from "~/utils/models/user";

export default Vue.extend({
  name: "FaTimeWindowCard",
  components: {
    FaTimeWindowTable,
    FestivalEventCalendar,
    FaTimeWindowForm,
    CardErrorList,
    ConfirmationMessage,
  },
  data: () => ({
    animOwner: "humain",
    matosOwners: ["matos", "barrieres", "elec"],
    cardType: FaCardType.TIME_WINDOW,

    isAddDialogOpen: false,
    isEditDialogOpen: false,
    isConfirmationDialogOpen: false,

    selectedTimeWindow: null as FaTimeWindowWithType | null,
  }),
  computed: {
    timeWindowsList(): FaTimeWindowWithType[] {
      const animationTimeWindows = this.$accessor.fa.mFA.timeWindows.map(
        (period) => ({ ...period, type: TimeWindowType.ANIM }),
      );

      const gearTimeWindows = this.$accessor.fa.gearRequestRentalPeriods.map(
        (period) => ({ ...period, type: TimeWindowType.MATOS }),
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
        owners,
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
    resetLogValidations() {
      const author: User = {
        id: this.me.id,
        firstname: this.me.firstname,
        lastname: this.me.lastname,
      };
      this.$accessor.fa.resetLogValidations(author);

      if (this.selectedTimeWindow) {
        this.deleteTimeWindow(this.selectedTimeWindow);
      }
    },
    addTimeWindow(timeWindow: FaTimeWindowWithType) {
      const timeWindowWithoutType = { ...timeWindow, type: undefined };
      if (this.isAnimationTimeWindow(timeWindow)) {
        return this.$accessor.fa.addAnimationTimeWindow(timeWindowWithoutType);
      }
      this.$accessor.fa.addGearRequestRentalPeriod(timeWindowWithoutType);
    },
    updateTimeWindow(timeWindow: FaTimeWindowWithType) {
      const timeWindowWithoutType = { ...timeWindow, type: undefined };
      if (this.isAnimationTimeWindow(timeWindow)) {
        return this.$accessor.fa.updateAnimationTimeWindow(
          timeWindowWithoutType,
        );
      }
      if (!timeWindow.id) return;
      this.$accessor.fa.updateGearPeriod(timeWindowWithoutType as Period);
    },
    deleteTimeWindow(timeWindow: FaTimeWindowWithType) {
      if (this.isAnimationTimeWindow(timeWindow)) {
        return this.$accessor.fa.deleteAnimationTimeWindow(timeWindow);
      }
      return this.$accessor.fa.removeGearRequestRentalPeriod(
        timeWindow as Period,
      );
    },
    openEditDialog(timeWindow: FaTimeWindowWithType) {
      this.selectedTimeWindow = timeWindow;
      this.isEditDialogOpen = true;
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeTimeWindowDialog() {
      this.isAddDialogOpen = false;
      this.isEditDialogOpen = false;
      this.selectedTimeWindow = null;
    },
    openConfirmationDialog() {
      this.isConfirmationDialogOpen = true;
    },
    isAnimationTimeWindow(timeWindow: FaTimeWindowWithType): boolean {
      return timeWindow.type === TimeWindowType.ANIM;
    },
  },
});
</script>
