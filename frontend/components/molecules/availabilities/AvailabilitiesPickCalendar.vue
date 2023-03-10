<template>
  <OverCalendarV2
    :date="period.start"
    :display-header="false"
    :weekdays="weekdayNumbers"
    class="no-scroll elevation-2"
    @change="selectDay"
  >
    <template #day-label-header="{ date }">
      <div class="day-header">
        <p>{{ formatDateDay(date) }}</p>
        <p>{{ formatDateDayNumber(date) }}</p>
      </div>
    </template>
    <template #interval="{ date, hour }">
      <div
        v-if="isEndOfPeriod(hour)"
        class="event"
        :class="{
          'two-hours': !isPartyShift(hour),
          'one-hour': isPartyShift(hour),
          selected: isSelected(date, hour),
          saved: isSaved(date, hour),
          'is-error': hasError(date, hour),
        }"
        @click="selectPeriod(date, hour)"
      >
        {{ getDisplayedCharisma(date, hour) }}
      </div>
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { PeriodOrchestrator } from "~/domain/volunteer-availability/period-orchestrator";
import {
  hasAvailabilityPeriodError,
  isAvailabilityPeriodSaved,
  isAvailabilityPeriodSelected,
  isEndOfAvailabilityPeriod,
  isPeriodIncludedByAnother,
} from "~/utils/availabilities/availabilities";
import { generateNewPeriod } from "~/utils/availabilities/period";
import { getCharismaByDate } from "~/utils/models/charismaPeriod";
import { Period } from "~/utils/models/period";
import { isPartyShift } from "~/utils/shift/shift";
import {
  formatDateDayName,
  formatDateDayNumber,
  computeTomorrowDate,
  setDateHour,
} from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
  components: { OverCalendarV2 },
  props: {
    period: {
      type: Object as () => Period,
      required: true,
      default: () => ({
        start: new Date(),
        end: new Date(),
      }),
    },
  },
  computed: {
    savedAvailabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilityRegistery
        .availabilities;
    },
    periodOrchestrator(): PeriodOrchestrator {
      return this.$accessor.volunteerAvailability.periodOrchestrator;
    },
    selectedAvailabilities(): Period[] {
      return this.periodOrchestrator.availabilityPeriods;
    },
    isSelected(): (date: string | Date, hour: number) => boolean {
      return isAvailabilityPeriodSelected(
        this.selectedAvailabilities,
        this.savedAvailabilities
      );
    },
    isAllPeriodsInDaySelected(): (date: Date) => boolean {
      return (date: Date) => {
        const start = setDateHour(date, 0);
        const end = computeTomorrowDate(start);
        const period = { start, end };
        return this.selectedAvailabilities.some(
          isPeriodIncludedByAnother(period)
        );
      };
    },
    isSaved(): (date: string | Date, hour: number) => boolean {
      return isAvailabilityPeriodSaved(this.savedAvailabilities);
    },
    hasError(): (date: string | Date, hour: number) => boolean {
      return hasAvailabilityPeriodError(this.periodOrchestrator);
    },
    weekdayNumbers(): Number[] {
      return this.generateWeekdayList([], new Date(this.period.start));
    },
  },
  methods: {
    isEndOfPeriod(hour: number): boolean {
      return isEndOfAvailabilityPeriod(hour);
    },
    isPartyShift(hour: number): boolean {
      return isPartyShift(hour);
    },
    formatDateDay(dateString: string): string {
      return formatDateDayName(dateString);
    },
    formatDateDayNumber(dateString: string): string {
      return formatDateDayNumber(dateString);
    },
    generateWeekdayList(weekdays: number[], date: Date): number[] {
      if (date > this.period.end) return weekdays;
      const weekday = date.getDay();
      const tomorrow = computeTomorrowDate(date);
      return this.generateWeekdayList([...weekdays, weekday], tomorrow);
    },
    selectPeriod(dateString: string, hour: number) {
      const date = new Date(dateString);
      if (this.isSaved(date, hour)) return;

      const updatedDate = setDateHour(date, hour);
      if (this.isSelected(date, hour)) return this.removePeriod(updatedDate);
      this.addPeriod(updatedDate);
    },
    selectDay(dateString: string) {
      const date = new Date(dateString);
      if (this.isAllPeriodsInDaySelected(date))
        return this.removePeriodsInDay(date);
      this.addPeriodsInDay(date);
    },
    addPeriod(date: Date) {
      const periodToAdd = generateNewPeriod(date);
      this.$accessor.volunteerAvailability.addAvailabilityPeriod(periodToAdd);
      this.incrementCharismaByDate(periodToAdd.start);
    },
    addPeriodsInDay(date: Date) {
      const periodsToAdd = this.generateAllPeriodsFor(date).filter(
        (period) => !this.isSelected(period.start, period.start.getHours())
      );
      this.$accessor.volunteerAvailability.addAvailabilityPeriods(periodsToAdd);
      periodsToAdd.map((period) => this.incrementCharismaByDate(period.start));
    },
    getPeriodDurationInHours(hour: number): number {
      return this.isPartyShift(hour) ? 1 : 2;
    },
    generateAllPeriodsFor(dayDate: Date): Period[] {
      const periods = [];
      for (let hour = 0; hour < 24; hour++) {
        if (!this.isEndOfPeriod(hour)) continue;

        const newPeriod = generateNewPeriod(setDateHour(dayDate, hour));
        periods.push(newPeriod);
      }
      return periods;
    },
    removePeriod(date: Date) {
      const periodToRemove = generateNewPeriod(date);
      this.$accessor.volunteerAvailability.removeAvailabilityPeriod(
        periodToRemove
      );
      this.decrementCharismaByDate(date);
    },
    removePeriodsInDay(date: Date) {
      const periodsToRemove = this.generateAllPeriodsFor(date).filter(
        (period) => this.isSelected(period.start, period.start.getHours())
      );
      this.$accessor.volunteerAvailability.removeAvailabilityPeriods(
        periodsToRemove
      );
      periodsToRemove.map((period) =>
        this.decrementCharismaByDate(period.start)
      );
    },
    getCharismaByDate(date: Date): number {
      const charismaPeriods =
        this.$accessor.charismaPeriod.charismaPeriods ?? [];
      return getCharismaByDate(charismaPeriods, date);
    },
    getDisplayedCharisma(date: string, hour: number): number {
      const charisma = this.getCharismaByDate(
        setDateHour(new Date(date), hour)
      );
      return charisma * this.getPeriodDurationInHours(hour);
    },
    incrementCharismaByDate(date: Date) {
      this.$accessor.volunteerAvailability.incrementCharisma(
        this.getCharismaByDate(date) *
          this.getPeriodDurationInHours(date.getHours())
      );
    },
    decrementCharismaByDate(date: Date) {
      this.$accessor.volunteerAvailability.decrementCharisma(
        this.getCharismaByDate(date) *
          this.getPeriodDurationInHours(date.getHours())
      );
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

.selected {
  background-color: rgba(25, 118, 210, 1);
  color: white;
}

.saved {
  background-color: rgba(76, 175, 80, 1);
  color: white;
}

.is-error {
  background-color: red;
  color: white;
}

/* Hover only on computer but not with touchscreen */
@media (hover: hover) and (pointer: fine) {
  .event:hover:not(.saved) {
    background-color: rgba(25, 118, 210, 0.8);
  }
}

.one-hour {
  height: 100%;
}

.two-hours {
  height: 200%;
}

.day-header {
  min-height: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin: 0;
  }
}

/* hide the scrollbar */
.no-scroll {
  .v-calendar-daily__head {
    margin-right: 0;
  }

  .v-calendar-daily__scroll-area {
    overflow: hidden;
  }
}
</style>
