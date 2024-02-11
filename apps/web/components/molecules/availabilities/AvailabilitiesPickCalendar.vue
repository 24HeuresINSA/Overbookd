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
          selected: isSelected(date, hour),
          saved: isSaved(date, hour),
          'is-error': hasError(date, hour),
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
import {
  DateString,
  Hour,
  IProvidePeriod,
  ONE_DAY_IN_MS,
  OverDate,
  Period,
} from "@overbookd/period";
import {
  AvailabilityDate,
  PeriodOrchestrator,
} from "@overbookd/volunteer-availability";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import {
  ALL_HOURS,
  hasAvailabilityPeriodError,
  isEndOfAvailabilityPeriod,
} from "~/utils/availabilities/availabilities";
import { getCharismaByDate } from "~/utils/models/charisma-period.model";
import { isPartyShift } from "~/utils/shift/shift";
import {
  formatDateDayName,
  formatDateDayNumber,
  computeTomorrowDate,
} from "~/utils/date/date.utils";

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
    savedAvailabilities(): IProvidePeriod[] {
      return this.$accessor.volunteerAvailability.availabilityRegistery
        .availabilities;
    },
    periodOrchestrator(): PeriodOrchestrator {
      return this.$accessor.volunteerAvailability.periodOrchestrator;
    },
    selectedAvailabilities(): Period[] {
      return this.periodOrchestrator.availabilityPeriods;
    },
    isSelected(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const availabilityDate = OverDate.init({ date, hour });
        const periods = [
          ...this.selectedAvailabilities,
          ...this.savedAvailabilities,
        ];
        return availabilityDate.isIncludedBy(periods);
      };
    },
    isAllPeriodsInDaySelected(): (date: AvailabilityDate) => boolean {
      return (date: AvailabilityDate) => {
        const start = date.date;
        const tomorrow = new Date(start.getTime() + ONE_DAY_IN_MS);
        const period = Period.init({ start, end: tomorrow });
        return this.selectedAvailabilities.every((availability) =>
          period.includes(availability),
        );
      };
    },
    isSaved(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const availabilityDate = OverDate.init({ date, hour });
        return availabilityDate.isIncludedBy(this.savedAvailabilities);
      };
    },
    hasError(): (date: DateString, hour: Hour) => boolean {
      return hasAvailabilityPeriodError(this.periodOrchestrator);
    },
    weekdayNumbers(): number[] {
      return this.generateWeekdayList([], new Date(this.period.start));
    },
  },
  methods: {
    isEndOfPeriod(hour: Hour): boolean {
      return isEndOfAvailabilityPeriod(hour);
    },
    isPartyShift(hour: Hour): boolean {
      return isPartyShift(hour);
    },
    formatDateDay(dateString: DateString): string {
      return formatDateDayName(dateString);
    },
    formatDateDayNumber(dateString: DateString): string {
      return formatDateDayNumber(dateString);
    },
    generateWeekdayList(weekdays: number[], date: Date): number[] {
      if (date > this.period.end) return weekdays;
      const weekday = date.getDay();
      const tomorrow = computeTomorrowDate(date);
      return this.generateWeekdayList([...weekdays, weekday], tomorrow);
    },
    selectPeriod(dateString: DateString, hour: Hour) {
      if (this.isSaved(dateString, hour)) return;

      const { period } = AvailabilityDate.init({ date: dateString, hour });
      if (this.isSelected(dateString, hour)) return this.removePeriod(period);

      this.addPeriod(period);
    },
    selectDay(dateString: DateString) {
      const date = AvailabilityDate.init({ date: dateString, hour: 0 });
      if (this.isAllPeriodsInDaySelected(date)) {
        return this.removePeriodsInDay(dateString);
      }

      this.addPeriodsInDay(dateString);
    },
    addPeriod(period: Period) {
      this.$accessor.volunteerAvailability.addAvailabilityPeriod(period);
      this.incrementCharismaByPeriod(period);
    },
    addPeriodsInDay(date: DateString) {
      const periodsToAdd = ALL_HOURS.filter(
        (hour) => !this.isSelected(date, hour),
      ).map((hour) => AvailabilityDate.init({ date, hour }).period);

      this.$accessor.volunteerAvailability.addAvailabilityPeriods(periodsToAdd);
      periodsToAdd.map((period) => this.incrementCharismaByPeriod(period));
    },
    getPeriodDurationInHours(hour: Hour): number {
      return this.isPartyShift(hour) ? 1 : 2;
    },
    removePeriod(period: Period) {
      this.$accessor.volunteerAvailability.removeAvailabilityPeriod(period);
      this.decrementCharismaByPeriod(period);
    },
    removePeriodsInDay(date: DateString) {
      const periodsToRemove = ALL_HOURS.filter((hour) =>
        this.isSelected(date, hour),
      ).map((hour) => AvailabilityDate.init({ date, hour }).period);

      this.$accessor.volunteerAvailability.removeAvailabilityPeriods(
        periodsToRemove,
      );
      periodsToRemove.map((period) => this.decrementCharismaByPeriod(period));
    },
    getCharismaByDate(date: Date): number {
      const charismaPeriods =
        this.$accessor.charismaPeriod.charismaPeriods ?? [];
      return getCharismaByDate(charismaPeriods, date);
    },
    getDisplayedCharisma(date: DateString, hour: Hour): number {
      const charisma = this.getCharismaByDate(
        OverDate.init({ date, hour }).date,
      );
      return charisma * this.getPeriodDurationInHours(hour);
    },
    incrementCharismaByPeriod(period: Period) {
      this.$accessor.volunteerAvailability.incrementCharisma(
        this.getCharismaByDate(period.start) * period.duration.inHours,
      );
    },
    decrementCharismaByPeriod(period: Period) {
      this.$accessor.volunteerAvailability.decrementCharisma(
        this.getCharismaByDate(period.start) * period.duration.inHours,
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
