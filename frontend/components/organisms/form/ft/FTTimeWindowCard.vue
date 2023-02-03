<template>
  <div>
    <v-card :class="validationStatus">
      <CardErrorList :type="cardType" />
      <v-card-title>Créneau</v-card-title>
      <v-card-text>
        <FTTimeWindowTable
          @update-time="openEditTimeDialog"
          @update-volunteer="openEditVolunteerDialog"
          @delete="deleteTimeWindow"
        ></FTTimeWindowTable>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="openAddDialog">Ajouter un créneau</v-btn>
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
        @change="updateRequirements"
      ></FTVolunteerRequirementForm>
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
import { getFTValidationStatusWithMultipleTeams } from "~/utils/festivalEvent/ftUtils";

export default Vue.extend({
  name: "FTTimeWindowCard",
  components: {
    FTTimeWindowTable,
    FestivalEventCalendar,
    FTTimeWindowForm,
    FTVolunteerRequirementForm,
    CardErrorList,
  },
  data: () => ({
    owners: ["humain", "matos"],
    cardType: FTCardType.TIME_WINDOW,

    isAddDialogOpen: false,
    isEditTimeDialogOpen: false,
    isEditVolunteerDialogOpen: false,
    selectedTimeWindow: null as FTTimeWindow | null,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    validationStatus(): string {
      return getFTValidationStatusWithMultipleTeams(
        this.mFT,
        this.owners
      ).toLowerCase();
    },
  },
  methods: {
    addTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.addTimeWindow(timeWindow);
      this.$accessor.FT.addGearRequestRentalPeriod({
        start: timeWindow.start,
        end: timeWindow.end,
      });
      this.closeAddDialog();
    },
    updateTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.updateTimeWindow(timeWindow);
      this.closeAllEditDialogs();
    },
    updateRequirements(timeWindow: FTTimeWindow) {
      this.$accessor.FT.updateTimeWindowRequirements(timeWindow);
      this.closeAllEditDialogs();
    },
    deleteTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.deleteTimeWindow(timeWindow);
      this.$accessor.FT.removeGearRequestRentalPeriod({
        start: timeWindow.start,
        end: timeWindow.end,
      });
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
  },
});
</script>
