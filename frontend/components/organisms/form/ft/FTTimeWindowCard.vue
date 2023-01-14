<template>
  <div>
    <v-card>
      <v-card-title>Créneau</v-card-title>
      <v-card-text>
        <FTTimeWindowTable
          @update="openEditDialog"
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
    <v-dialog v-model="isEditDialogOpen" max-width="700">
      <FTTimeWindowForm
        :time-window="selectedTimeWindow"
        @change="updateTimeWindow"
      ></FTTimeWindowForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FTTimeWindowTable from "~/components/molecules/timeframe/FTTimeWindowTable.vue";
import FestivalEventCalendar from "~/components/molecules/timeframe/FestivalEventCalendar.vue";
import FTTimeWindowForm from "~/components/molecules/timeframe/FTTimeWindowForm.vue";
import { FT, FTTimeWindow } from "~/utils/models/ft";

export default Vue.extend({
  name: "FTTimeWindowCard",
  components: { FTTimeWindowTable, FestivalEventCalendar, FTTimeWindowForm },
  data: () => ({
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    selectedTimeWindow: null as FTTimeWindow | null,
    selectedIndex: null as number | null,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    addTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.addTimeWindow(timeWindow);
      this.closeAddDialog();
    },
    updateTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.updateTimeWindow({
        index: this.selectedIndex,
        timeWindow,
      });
      this.closeEditDialog();
    },
    deleteTimeWindow(index: number) {
      this.$accessor.FT.deleteTimeWindow(index);
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
    openEditDialog(index: number, timeWindow: FTTimeWindow) {
      this.selectedIndex = index;
      this.selectedTimeWindow = timeWindow;
      this.isEditDialogOpen = true;
    },
    closeEditDialog() {
      this.selectedIndex = null;
      this.selectedTimeWindow = null;
      this.isEditDialogOpen = false;
    },
  },
});
</script>

<style scoped></style>
