<template>
  <v-card class="period-card">
    <v-btn class="period-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="period-card__title">
      <h2>Ajouter un créneau</h2>
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
        @enter="addTimeWindow"
      />
    </v-card-text>

    <v-card-actions class="period-card__actions">
      <v-btn :disabled="!isValid" color="primary" large @click="addTimeWindow">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter le créneau
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PeriodFormFields from "~/components/molecules/period/PeriodFormFields.vue";
import { formatDate } from "~/utils/date/date.utils";
import { IProvidePeriod, Period } from "@overbookd/period";

export default defineComponent({
  name: "PeriodForm",
  components: { PeriodFormFields },
  emits: ["add", "close-dialog"],
  data: (): IProvidePeriod => ({
    start: new Date(),
    end: new Date(),
  }),
  computed: {
    period(): IProvidePeriod {
      return { start: this.start, end: this.end };
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    displayedManifDate(): string {
      return `vendredi ${formatDate(this.eventStartDate)}`;
    },
    isValid(): boolean {
      return Period.isValid(this.period);
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.setDefaultDates();
  },
  methods: {
    setDefaultDates() {
      this.start = this.eventStartDate;
      this.end = this.eventStartDate;
    },
    addTimeWindow() {
      if (!this.isValid) return;
      this.$emit("add", this.period);

      this.closeDialog();
      this.setDefaultDates();
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
.period-card {
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
