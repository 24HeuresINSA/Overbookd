<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList festival-event="FT" :type="cardType" />
      <v-card-title>Créneau</v-card-title>
      <v-card-text>
        <FTTimeWindowTable
          :disabled="isValidatedByOwners"
          @update-time="openEditTimeDialog"
          @update-volunteer="openEditVolunteerDialog"
          @delete="deleteTimeWindow"
        ></FTTimeWindowTable>
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
      <FTTimeWindowForm @change="addTimeWindow"></FTTimeWindowForm>
    </v-dialog>

    <v-dialog v-model="isEditTimeDialogOpen" max-width="700">
      <FTTimeWindowForm
        :time-window="selectedTimeWindow"
        @change="updateTimeWindow"
      ></FTTimeWindowForm>
    </v-dialog>

    <v-dialog v-model="isEditVolunteerDialogOpen" max-width="700">
      <FTVolunteerRequirementForm
        :time-window="selectedTimeWindow"
        @close-dialog="closeAllEditDialogs"
        @change="updateRequirements"
      ></FTVolunteerRequirementForm>
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
import FTTimeWindowTable from "~/components/molecules/timeframe/FTTimeWindowTable.vue";
import FestivalEventCalendar from "~/components/molecules/timeframe/FestivalEventCalendar.vue";
import FTTimeWindowForm from "~/components/molecules/timeframe/FTTimeWindowForm.vue";
import { FT, FTCardType, FTTimeWindow } from "~/utils/models/ft";
import FTVolunteerRequirementForm from "~/components/molecules/timeframe/FTVolunteerRequirementForm.vue";
import CardErrorList from "~/components/molecules/CardErrorList.vue";
import {
  getFTValidationStatusWithMultipleTeams,
  hasAllFTValidations,
  hasAtLeastOneFTValidation,
} from "~/utils/festivalEvent/ftUtils";
import ConfirmationMessage from "~/components/atoms/ConfirmationMessage.vue";

enum ConfirmationType {
  ADD = "Ajout",
  UPDATE = "Modification",
  DELETE = "Suppression",
}

interface ConfirmationDialogData {
  title: String;
  text: String;
}

export default Vue.extend({
  name: "FTTimeWindowCard",
  components: {
    FTTimeWindowTable,
    FestivalEventCalendar,
    FTTimeWindowForm,
    FTVolunteerRequirementForm,
    CardErrorList,
    ConfirmationMessage,
  },
  data: () => ({
    owners: ["humain", "matos"],
    cardType: FTCardType.TIME_WINDOW,

    isAddDialogOpen: false,
    isEditTimeDialogOpen: false,
    isEditVolunteerDialogOpen: false,
    isConfirmationDialogOpen: false,
    confirmationType: ConfirmationType.ADD,
    selectedTimeWindow: null as FTTimeWindow | null,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
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
        this.owners
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
    addTimeWindow(timeWindow: FTTimeWindow) {
      if (this.isConfirmationNeeded) {
        this.confirmationType = ConfirmationType.ADD;
        this.selectedTimeWindow = timeWindow;
        return this.openConfirmationDialog();
      }

      this.$accessor.FT.addTimeWindow(timeWindow);
      this.$accessor.FT.addGearRequestRentalPeriod({
        start: timeWindow.start,
        end: timeWindow.end,
      });
      this.closeAddDialog();
    },
    updateTimeWindow(timeWindow: FTTimeWindow) {
      if (this.isConfirmationNeeded) {
        this.confirmationType = ConfirmationType.UPDATE;
        this.selectedTimeWindow = timeWindow;
        return this.openConfirmationDialog();
      }

      this.$accessor.FT.updateTimeWindow(timeWindow);
      this.closeAllEditDialogs();
    },
    updateRequirements(timeWindow: FTTimeWindow) {
      this.$accessor.FT.updateTimeWindowRequirements(timeWindow);
      this.closeAllEditDialogs();
    },
    deleteTimeWindow(timeWindow: FTTimeWindow) {
      if (this.isConfirmationNeeded) {
        this.confirmationType = ConfirmationType.DELETE;
        this.selectedTimeWindow = timeWindow;
        return this.openConfirmationDialog();
      }

      this.$accessor.FT.deleteTimeWindow(timeWindow);
      this.$accessor.FT.removeGearRequestRentalPeriod({
        start: timeWindow.start,
        end: timeWindow.end,
      });
    },
    resetValidations() {
      if (!this.selectedTimeWindow) return;
      this.$accessor.FT.resetValidations();

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
    openEditTimeDialog(timeWindow: FTTimeWindow) {
      this.selectedTimeWindow = timeWindow;
      this.isEditTimeDialogOpen = true;
    },
    openEditVolunteerDialog(timeWindow: FTTimeWindow) {
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
