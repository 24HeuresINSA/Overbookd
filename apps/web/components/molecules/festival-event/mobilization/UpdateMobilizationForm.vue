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
      <MobilizationPeriodFormFields
        :start="start"
        :end="end"
        :duration-split-in-hour="durationSplitInHour"
        @update:start="updateStart"
        @update:end="updateEnd"
        @update:duration-split-in-hour="updateDurationSplitInHour"
      />
    </v-card-text>

    <v-card-actions class="mobilization-card__actions">
      <v-btn
        :disabled="!canUpdateMobilization"
        color="primary"
        large
        @click="updateMobilization"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Modifier la mobilisation
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MobilizationPeriodFormFields from "./MobilizationPeriodFormFields.vue";
import { formatDate } from "~/utils/date/date.utils";
import { IProvidePeriod, Period } from "@overbookd/period";
import { Mobilization, UpdateMobilization } from "@overbookd/festival-event";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

type UpdateMobilizationFormData = IProvidePeriod &
  InputRulesData & {
    durationSplitInHour: number | null;
  };

export default defineComponent({
  name: "UpdateMobilizationForm",
  components: { MobilizationPeriodFormFields },
  emits: ["update", "close-dialog"],
  props: {
    mobilization: {
      type: Object as () => Mobilization,
      required: true,
    },
  },
  data: (): UpdateMobilizationFormData => ({
    start: new Date(),
    end: new Date(),
    durationSplitInHour: null,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mobilizationBuilt(): UpdateMobilization {
      return {
        start: this.start,
        end: this.end,
        durationSplitInHour: this.durationSplitInHour,
      };
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    displayedManifDate(): string {
      return `vendredi ${formatDate(this.eventStartDate)}`;
    },
    canUpdateMobilization(): boolean {
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
    this.updateDataWithMobilizationToUpdate();
  },
  watch: {
    mobilization() {
      this.updateDataWithMobilizationToUpdate();
    },
  },
  methods: {
    updateDataWithMobilizationToUpdate() {
      this.start = this.mobilization.start;
      this.end = this.mobilization.end;
      this.durationSplitInHour = this.mobilization.durationSplitInHour;
    },
    updateMobilization() {
      if (!this.canUpdateMobilization) return;
      this.$emit("update", this.mobilizationBuilt);

      this.closeDialog();
      this.updateDataWithMobilizationToUpdate();
    },
    updateStart(start: Date) {
      this.start = start;
    },
    updateEnd(end: Date) {
      this.end = end;
    },
    updateDurationSplitInHour(durationSplitInHour: number | null) {
      this.durationSplitInHour = durationSplitInHour;
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
