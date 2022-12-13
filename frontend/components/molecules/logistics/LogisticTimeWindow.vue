<template>
  <div>
    <v-card :class="validationStatus">
      <v-card-title :disabled="isValidatedByOwners"
        >Créneau de matos</v-card-title
      >
      <v-card-subtitle
        >Vous ne pouvez pas ajouter du matos sans ce créneau</v-card-subtitle
      >
      <v-card-text>
        <div v-show="gearTimeWindow" class="time-window">
          <v-chip color="primary">
            <span class="temporal">De</span>
            <span class="date">{{ startDate }}</span>
          </v-chip>
          <v-chip color="primary">
            <span class="temporal">A</span>
            <span class="date">{{ endDate }}</span>
          </v-chip>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          v-if="gearTimeWindow"
          text
          :disabled="isValidatedByOwners"
          @click="openUpdateDialog"
          >Modifier le créneau</v-btn
        >
        <v-btn
          v-else
          text
          :disabled="isValidatedByOwners"
          @click="openAddDialog"
          >Ajouter un créneau</v-btn
        >
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <TimeframeForm
        :type="type"
        @change="addTimeWindow"
        @close-dialog="isAddDialogOpen = false"
      ></TimeframeForm>
    </v-dialog>

    <v-dialog v-model="isUpdateDialogOpen" max-width="600">
      <TimeframeForm
        :type="type"
        :time-window="gearTimeWindow"
        @change="updateTimeWindow"
        @close-dialog="isUpdateDialogOpen = false"
      ></TimeframeForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import { FA, Status, time_windows, time_windows_type } from "~/utils/models/FA";
import TimeframeForm from "../timeframe/TimeframeForm.vue";

export default Vue.extend({
  name: "LogisticTimeWindow",
  components: { TimeframeForm },
  data: () => ({
    isAddDialogOpen: false,
    isUpdateDialogOpen: false,
  }),
  computed: {
    gearTimeWindow(): time_windows | undefined {
      return this.$accessor.FA.gearTimeWindow;
    },
    gearTimeWindowIndex(): number {
      return this.$accessor.FA.gearTimeWindowIndex;
    },
    type(): time_windows_type {
      return time_windows_type.MATOS;
    },
    startDate(): string {
      return this.gearTimeWindow?.start
        ? this.displayDate(this.gearTimeWindow.start)
        : "";
    },
    endDate(): string {
      return this.gearTimeWindow?.end
        ? this.displayDate(this.gearTimeWindow.end)
        : "";
    },
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwners(): boolean {
      const byMatos = isAnimationValidatedBy(this.mFA, "matos");
      const byBarrieres = isAnimationValidatedBy(this.mFA, "barrieres");
      const byElec = isAnimationValidatedBy(this.mFA, "elec");

      if (byMatos && byBarrieres && byElec) return true;
      return false;
    },
    validationStatus(): string {
      const matosStatus = getFAValidationStatus(this.mFA, "matos");
      const barrieresStatus = getFAValidationStatus(this.mFA, "barrieres");
      const elecStatus = getFAValidationStatus(this.mFA, "elec");

      const areAllValidated =
        matosStatus === Status.VALIDATED &&
        barrieresStatus === Status.VALIDATED &&
        elecStatus === Status.VALIDATED;
      if (areAllValidated) return Status.VALIDATED.toLowerCase();

      const areAllRefused =
        matosStatus === Status.REFUSED &&
        barrieresStatus === Status.REFUSED &&
        elecStatus === Status.REFUSED;
      if (areAllRefused) return Status.REFUSED.toLowerCase();

      const hasAtLeastOneSubmitted =
        matosStatus === Status.SUBMITTED ||
        barrieresStatus === Status.SUBMITTED ||
        elecStatus === Status.SUBMITTED;
      if (hasAtLeastOneSubmitted) return Status.SUBMITTED.toLowerCase();

      return Status.DRAFT.toLowerCase();
    },
  },
  methods: {
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    openUpdateDialog() {
      this.isUpdateDialogOpen = true;
    },
    addTimeWindow(timeWindow: time_windows) {
      this.$accessor.FA.addTimeWindow(timeWindow);
    },
    updateTimeWindow(timeWindow: time_windows) {
      if (this.gearTimeWindowIndex === -1) return;

      this.$accessor.FA.updateGearTimeWindow(timeWindow);
      this.$accessor.FA.updateTimeWindow({
        index: this.gearTimeWindowIndex,
        timeWindow,
      });
    },
    displayDate(date: Date): string {
      const displayOptions: Intl.DateTimeFormatOptions = {
        dateStyle: "long",
        timeStyle: "short",
      };
      return new Intl.DateTimeFormat("fr", displayOptions).format(
        new Date(date)
      );
    },
  },
});
</script>

<style lang="scss">
.time-window {
  display: flex;
  gap: 30px;
  .temporal {
    font-weight: 600;
  }
  .date {
    margin-left: 5px;
  }
}
</style>
