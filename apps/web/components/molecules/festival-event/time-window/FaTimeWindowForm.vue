<template>
  <v-card class="time-window-card">
    <v-btn class="time-window-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="time-window-card__title">
      <h2>Ajouter un créneau</h2>
    </v-card-title>

    <v-card-subtitle>
      La manif commencera le {{ displayedManifDate }}.
    </v-card-subtitle>

    <v-card-text class="pb-0">
      <h3>Début du créneau</h3>
      <DateTimeField v-model="start" label="Début" @enter="addTimeWindow" />

      <h3>Fin du créneau</h3>
      <DateTimeField
        v-model="end"
        label="Fin"
        :error-messages="errors"
        @enter="addTimeWindow"
      />
    </v-card-text>

    <v-card-actions class="time-window-card__actions">
      <v-btn :disabled="!isValid" color="primary" large @click="addTimeWindow">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter le créneau
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { formatDate } from "~/utils/date/date.utils";
import { Period, IProvidePeriod } from "@overbookd/period";

interface FaTimeWindowFormData {
  start: Date;
  end: Date;
}

export default defineComponent({
  name: "FaTimeWindowForm",
  components: { DateTimeField },
  data: (): FaTimeWindowFormData => ({
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
    errors(): string[] {
      return Period.errors(this.period);
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
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.time-window-card {
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
  &__form {
    padding-bottom: 0;
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
