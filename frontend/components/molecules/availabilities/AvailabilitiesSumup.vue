<template>
  <div>
    <OverCalendarV2 v-model="calendarMarker" :title="calendarTitle">
      <template #interval="{ date, hour }">
        <div
          v-if="isEndOfPeriod(hour)"
          class="event"
          :class="{
            'two-hours': !isPartyShift(hour),
            'one-hour': isPartyShift(hour),
            selected: isSelected(date, hour),
            'is-error': hasError(date, hour),
            'read-only': isReadonly,
          }"
          @click="togglePeriod(date, hour)"
        ></div>
      </template>
    </OverCalendarV2>
    <div class="cta">
      <v-btn
        v-if="!isReadonly"
        color="success"
        class="cta__btn"
        @click="saveAvailabilities"
      >
        Valider
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { PeriodOrchestrator } from "~/domain/volunteer-availability/period-orchestrator";
import {
  hasAvailabilityPeriodError,
  isAvailabilityPeriodSelected,
  isEndOfAvailabilityPeriod,
} from "~/utils/availabilities/availabilities";
import { generateNewPeriod } from "~/utils/availabilities/period";
import {
  formatDateWithExplicitMonth,
  setDateHour,
} from "~/utils/date/dateUtils";
import { Period } from "~/utils/models/period";
import { isPartyShift } from "~/utils/shift/shift";

export default Vue.extend({
  name: "AvailabilitiesSumup",
  components: { OverCalendarV2 },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.calendarMarker);
    },
    periodOrchestrator(): PeriodOrchestrator {
      return this.$accessor.volunteerAvailability.periodOrchestrator;
    },
    selectedAvailabilities(): Period[] {
      return this.periodOrchestrator.availabilityPeriods;
    },
    isSelected(): (date: string | Date, hour: number) => boolean {
      return isAvailabilityPeriodSelected(this.selectedAvailabilities, []);
    },
    hasError(): (date: string | Date, hour: number) => boolean {
      return hasAvailabilityPeriodError(this.periodOrchestrator);
    },
    isReadonly(): boolean {
      return !this.$accessor.user.hasPermission("can-affect");
    },
  },
  watch: {
    userId() {
      this.fetchAvailabilities();
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  async created() {
    await this.fetchAvailabilities();
  },
  methods: {
    fetchAvailabilities() {
      return this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.userId
      );
    },
    isEndOfPeriod(hour: number): boolean {
      return isEndOfAvailabilityPeriod(hour);
    },
    isPartyShift(hour: number): boolean {
      return isPartyShift(hour);
    },
    togglePeriod(dateString: string, hour: number) {
      if (this.isReadonly) return;
      const date = new Date(dateString);
      const updatedDate = setDateHour(date, hour);
      if (this.isSelected(date, hour)) return this.removePeriod(updatedDate);
      this.addPeriod(updatedDate);
    },
    addPeriod(date: Date) {
      const periodToAdd = generateNewPeriod(date);
      this.$accessor.volunteerAvailability.addAvailabilityPeriod(periodToAdd);
    },
    removePeriod(date: Date) {
      const periodToRemove = generateNewPeriod(date);
      this.$accessor.volunteerAvailability.removeAvailabilityPeriod(
        periodToRemove
      );
    },
    async saveAvailabilities() {
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        this.userId
      );
      this.$emit("availabilities-updated", this.userId);
    },
  },
});
</script>

<style lang="scss" scoped>
.event {
  background-color: rgba(25, 118, 210, 0.2);
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  user-select: none;
}

.read-only {
  cursor: default;
}

.one-hour {
  height: 100%;
}

.two-hours {
  height: 200%;
}

.selected {
  background-color: rgba(25, 118, 210, 1);
  color: white;
}

.is-error {
  background-color: red;
  color: white;
}

/* Hover only on computer but not with touchscreen */
@media (hover: hover) and (pointer: fine) {
  .event:hover:not(.read-only) {
    background-color: rgba(25, 118, 210, 0.8);
  }
}

.cta {
  width: 100%;
  display: flex;
  justify-content: right;
  &__btn {
    margin: 5px;
  }
}
</style>
