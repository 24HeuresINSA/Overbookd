<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList festival-event="FT" :type="cardType" />
      <v-card-title>Créneau</v-card-title>
      <v-card-text>
        <FtTimeWindowTable
          :disabled="isValidatedByOwners"
          @update-time="openEditTimeDialog"
          @update-volunteer="openEditVolunteerDialog"
          @delete="deleteTimeWindow"
        ></FtTimeWindowTable>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="!isValidatedByOwners" text @click="openAddDialog">
          Ajouter un créneau
        </v-btn>
      </v-card-actions>
      <FestivalEventCalendar festival-event="FT" />
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="700">
      <FtTimeWindowForm @change="addTimeWindow" />
    </v-dialog>

    <v-dialog v-model="isEditTimeDialogOpen" max-width="700">
      <FtTimeWindowForm
        :time-window="selectedTimeWindow"
        @change="updateTimeWindow"
      ></FtTimeWindowForm>
    </v-dialog>

    <v-dialog v-model="isEditVolunteerDialogOpen" max-width="700">
      <FtVolunteerRequirementForm
        :time-window="selectedTimeWindow"
        @close-dialog="closeAllEditDialogs"
        @change="updateRequirements"
      ></FtVolunteerRequirementForm>
    </v-dialog>

    <v-dialog v-model="isConfirmationDialogOpen" max-width="600px">
      <ConfirmationMessage
        @close-dialog="closeConfirmationDialog"
        @confirm="resetValidations"
      >
        <template #title> {{ confirmationDialogData.title }} </template>
        <template #statement> {{ confirmationDialogData.text }} </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import FtTimeWindowForm from "~/components/molecules/festival-event/time-window/FtTimeWindowForm.vue";
import FtTimeWindowTable from "~/components/molecules/festival-event/time-window/FtTimeWindowTable.vue";
import FtVolunteerRequirementForm from "~/components/molecules/festival-event/time-window/FtVolunteerRequirementForm.vue";
import FestivalEventCalendar from "~/components/molecules/festival-event/time-window/FestivalEventCalendar.vue";
import CardErrorList from "~/components/molecules/festival-event/validation/CardErrorList.vue";
import {
  getFTValidationStatusWithMultipleTeams,
  hasAllFTValidations,
  hasAtLeastOneFTValidation,
} from "~/utils/festival-event/ft.utils";
import { Ft, FtCardType, FtTimeWindow } from "~/utils/models/ft.model";

enum ConfirmationType {
  ADD = "Ajout",
  UPDATE = "Modification",
  DELETE = "Suppression",
}

interface ConfirmationDialogData {
  title: string;
  text: string;
}

export default Vue.extend({
  name: "FtTimeWindowCard",
  components: {
    FtTimeWindowTable,
    FestivalEventCalendar,
    FtTimeWindowForm,
    FtVolunteerRequirementForm,
    CardErrorList,
    ConfirmationMessage,
  },
  data: () => ({
    owners: ["humain", "matos"],
    cardType: FtCardType.TIME_WINDOW,

    isAddDialogOpen: false,
    isEditTimeDialogOpen: false,
    isEditVolunteerDialogOpen: false,
    isConfirmationDialogOpen: false,
    confirmationType: ConfirmationType.ADD,
    selectedTimeWindow: null as FtTimeWindow | null,
  }),
  computed: {
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    isValidatedByOwners(): boolean {
      return hasAllFTValidations(this.mFT.reviews, this.owners);
    },
    isValidatedByAtLeastOneOwner(): boolean {
      return hasAtLeastOneFTValidation(this.mFT.reviews, this.owners);
    },
    validationStatus(): string {
      return getFTValidationStatusWithMultipleTeams(
        this.mFT,
        this.owners,
      ).toLowerCase();
    },
    isConfirmationNeeded(): boolean {
      return (
        this.isValidatedByAtLeastOneOwner && !this.isConfirmationDialogOpen
      );
    },
    confirmationDialogData(): ConfirmationDialogData {
      let data: ConfirmationDialogData = {
        title: "",
        text: "",
      };
      switch (this.confirmationType) {
        case ConfirmationType.ADD:
          data.title = "Ajouter un créneau";
          data.text = "Tu es sûr de vouloir ajouter ce créneau ?";
          break;
        case ConfirmationType.UPDATE:
          data.title = "Modifier un créneau";
          data.text = "Tu es sûr de vouloir modifier ce créneau ?";
          break;
        case ConfirmationType.DELETE:
          data.title = "Supprimer un créneau";
          data.text = "Tu es sûr de vouloir supprimer ce créneau ?";
          break;
      }
      data.text += " Cela annulera les validations en cours.";
      return data;
    },
  },
  methods: {
    addTimeWindow(timeWindow: FtTimeWindow) {
      if (this.isConfirmationNeeded) {
        this.confirmationType = ConfirmationType.ADD;
        this.selectedTimeWindow = timeWindow;
        return this.openConfirmationDialog();
      }

      this.$accessor.ft.addTimeWindow(timeWindow);
      this.$accessor.ft.addGearRequestRentalPeriod({
        start: timeWindow.start,
        end: timeWindow.end,
      });
      this.closeAddDialog();
    },
    updateTimeWindow(timeWindow: FtTimeWindow) {
      if (this.isConfirmationNeeded) {
        this.confirmationType = ConfirmationType.UPDATE;
        this.selectedTimeWindow = timeWindow;
        return this.openConfirmationDialog();
      }

      this.$accessor.ft.updateTimeWindow(timeWindow);
      this.closeAllEditDialogs();
    },
    updateRequirements(timeWindow: FtTimeWindow) {
      this.$accessor.ft.updateTimeWindowRequirements(timeWindow);
      this.closeAllEditDialogs();
    },
    deleteTimeWindow(timeWindow: FtTimeWindow) {
      if (this.isConfirmationNeeded) {
        this.confirmationType = ConfirmationType.DELETE;
        this.selectedTimeWindow = timeWindow;
        return this.openConfirmationDialog();
      }

      this.$accessor.ft.deleteTimeWindow(timeWindow);
      this.$accessor.ft.removeGearRequestRentalPeriod({
        start: timeWindow.start,
        end: timeWindow.end,
      });
    },
    resetValidations() {
      if (!this.selectedTimeWindow) return;
      this.$accessor.ft.resetValidations();

      switch (this.confirmationType) {
        case ConfirmationType.ADD:
          this.addTimeWindow(this.selectedTimeWindow);
          break;
        case ConfirmationType.UPDATE:
          this.updateTimeWindow(this.selectedTimeWindow);
          break;
        case ConfirmationType.DELETE:
          this.deleteTimeWindow(this.selectedTimeWindow);
          break;
      }

      this.closeConfirmationDialog();
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
    openEditTimeDialog(timeWindow: FtTimeWindow) {
      this.selectedTimeWindow = timeWindow;
      this.isEditTimeDialogOpen = true;
    },
    openEditVolunteerDialog(timeWindow: FtTimeWindow) {
      this.selectedTimeWindow = timeWindow;
      this.isEditVolunteerDialogOpen = true;
    },
    closeAllEditDialogs() {
      this.isEditTimeDialogOpen = false;
      this.isEditVolunteerDialogOpen = false;
      this.selectedTimeWindow = null;
    },
    openConfirmationDialog() {
      this.isConfirmationDialogOpen = true;
    },
    closeConfirmationDialog() {
      this.isConfirmationDialogOpen = false;
    },
  },
});
</script>
