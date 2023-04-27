<template>
  <OverCalendar
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
          selected: isSelected(generateParisDate(date, hour)),
          saved: isSaved(generateParisDate(date, hour)),
          'is-error': hasError(generateParisDate(date, hour)),
        }"
        @click="selectPeriod(date, hour)"
      >
        {{ getDisplayedCharisma(date, hour) }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
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
  generateParisDate,
} from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
  components: { OverCalendar },
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
    isSelected(): (date: string | Date) => boolean {
      return isAvailabilityPeriodSelected(
        this.selectedAvailabilities,
        this.savedAvailabilities
      );
    },
    isAllPeriodsInDaySelected(): (dayDate: string) => boolean {
      return (dayDate: string) => {
        console.log(dayDate);
        const start = generateParisDate(dayDate, 0);
        const end = computeTomorrowDate(start);
        const period = { start, end };
        console.log(period);
        const res = this.selectedAvailabilities.some((availability) => {
          if (!isPeriodIncludedByAnother(period)(availability)) {
            console.log(availability);
            return false;
          }
          return true;
        });
        console.log(res);
        return res;
      };
    },
    isSaved(): (date: string | Date) => boolean {
      return isAvailabilityPeriodSaved(this.savedAvailabilities);
    },
    hasError(): (date: string | Date) => boolean {
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
    selectPeriod(dayDate: string, hour: number) {
      const date = generateParisDate(dayDate, hour);
      if (this.isSaved(date)) return;

      if (this.isSelected(date)) return this.removePeriod(date);
      this.addPeriod(date);
    },
    selectDay(dayDate: string) {
      if (this.isAllPeriodsInDaySelected(dayDate))
        return this.removePeriodsInDay(dayDate);
      this.addPeriodsInDay(dayDate);
    },
    addPeriod(date: Date) {
      const periodToAdd = generateNewPeriod(date);
      this.$accessor.volunteerAvailability.addAvailabilityPeriod(periodToAdd);
      this.incrementCharismaByDate(periodToAdd.start);
    },
    addPeriodsInDay(dayDate: string) {
      const periodsToAdd = this.generateAllPeriodsForDay(dayDate).filter(
        (period) => !this.isSelected(period.start)
      );
      this.$accessor.volunteerAvailability.addAvailabilityPeriods(periodsToAdd);
      periodsToAdd.map((period) => this.incrementCharismaByDate(period.start));
    },
    getPeriodDurationInHours(hour: number): number {
      return this.isPartyShift(hour) ? 1 : 2;
    },
    generateAllPeriodsForDay(dayDate: string): Period[] {
      const periods = [];
      for (let hour = 0; hour < 24; hour++) {
        if (!this.isEndOfPeriod(hour)) continue;

        const newPeriod = generateNewPeriod(generateParisDate(dayDate, hour));
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
    removePeriodsInDay(dayDate: string) {
      const periodsToRemove = this.generateAllPeriodsForDay(dayDate).filter(
        (period) => this.isSelected(period.start)
      );
      console.log(periodsToRemove);
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
    generateParisDate(dayDate: string, hour: number = 0): Date {
      return generateParisDate(dayDate, hour);
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
