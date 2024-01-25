<template>
  <v-card class="mobilization-card">
    <v-btn class="mobilization-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="mobilization-card__title">
      <h2>Ajouter une mobilisation</h2>
    </v-card-title>

    <v-card-subtitle>
      La manif commencera le {{ displayedManifDate }}.
    </v-card-subtitle>

    <v-card-text class="pb-0">
      <PeriodFormFields
        :start="start"
        :end="end"
        @update:start="updateStart"
        @update:end="updateEnd"
        @enter="addMobilization"
      />
    </v-card-text>

    <v-card-actions class="mobilization-card__actions">
      <v-btn
        :disabled="!canAddMobilization"
        color="primary"
        large
        @click="addMobilization"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter la mobilisation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PeriodFormFields from "~/components/molecules/period/PeriodFormFields.vue";
import { formatDate } from "~/utils/date/date.utils";
import { IProvidePeriod, Period } from "@overbookd/period";
import { TeamMobilization } from "@overbookd/festival-event";
import { AddMobilizationForm } from "@overbookd/http";

type MobilizationFormData = IProvidePeriod & {
  durationSplitInHour: number | null;
  teams: TeamMobilization[];
  volunteers: number[];
};

export default defineComponent({
  name: "MobilizationForm",
  components: { PeriodFormFields },
  emits: ["add", "close-dialog"],
  data: (): MobilizationFormData => ({
    start: new Date(),
    end: new Date(),
    durationSplitInHour: null,
    teams: [],
    volunteers: [],
  }),
  computed: {
    mobilization(): AddMobilizationForm {
      return {
        start: this.start,
        end: this.end,
        durationSplitInHour: this.durationSplitInHour,
        teams: this.teams,
        volunteers: this.volunteers,
      };
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    displayedManifDate(): string {
      return `vendredi ${formatDate(this.eventStartDate)}`;
    },
    canAddMobilization(): boolean {
      const isPeriodValid = Period.isValid({
        start: this.start,
        end: this.end,
      });
      const isDurationValid =
        this.durationSplitInHour === null || this.durationSplitInHour > 0;

      return isPeriodValid && isDurationValid;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.clearData();
  },
  methods: {
    clearData() {
      this.start = this.eventStartDate;
      this.end = this.eventStartDate;
      this.durationSplitInHour = null;
      this.teams = [];
      this.volunteers = [];
    },
    addMobilization() {
      if (!this.canAddMobilization) return;
      this.$emit("add", this.mobilization);

      this.closeDialog();
      this.clearData();
    },
    updateStart(start: Date) {
      this.start = start;
    },
    updateEnd(end: Date) {
      this.end = end;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.mobilization-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
