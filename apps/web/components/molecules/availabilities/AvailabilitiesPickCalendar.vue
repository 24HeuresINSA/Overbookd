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
        @click="selectHour(date, hour)"
      >
        {{ getAssociatedCharisma(date, hour) }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import {
  DateString,
  Hour,
  ONE_DAY_IN_MS,
  OverDate,
  Period,
} from "@overbookd/period";
import {
  AvailabilityDate,
  AvailabilityErrorMessage,
  InitOverDate,} from "@overbookd/volunteer-availability";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import {
  ALL_HOURS,
  isEndOfAvailabilityPeriod,
} from "~/utils/availabilities/availabilities";
import {
  SavedCharismaPeriod,
  getPeriodCharisma,
} from "~/utils/models/charisma-period.model";
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
    charismaPeriods(): SavedCharismaPeriod[] {
      return this.$accessor.charismaPeriod.charismaPeriods ?? [];
    },
    selectedAvailabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.selected;
    },
    savedAvailabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.recorded;
    },
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
    errors(): AvailabilityErrorMessage[] {
      return this.$accessor.volunteerAvailability.availabilities.errors;
    },
    isSelected(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const { period } = OverDate.init({ date, hour });
        return this.selectedAvailabilities.some((availability) =>
          availability.includes(period),
        );
      };
    },
    isAllDaySelected(): (date: AvailabilityDate) => boolean {
      return (date: AvailabilityDate) => {
        const start = date.date;
        const tomorrow = new Date(start.getTime() + ONE_DAY_IN_MS);
        const period = Period.init({ start, end: tomorrow });
        return this.availabilities.some((availability) =>
          availability.includes(period),
        );
      };
    },
    isSaved(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const { period } = OverDate.init({ date, hour });
        return this.savedAvailabilities.some((availability) =>
          availability.includes(period),
        );
      };
    },
    isAvailableOn(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        return this.isSaved(date, hour) || this.isSelected(date, hour);
      };
    },
    hasError(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const start = OverDate.init({ date, hour }).date;
        return this.errors.some(({ period }) => period.isIncluding(start));
      };
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
    selectHour(dateString: DateString, hour: Hour) {
      if (this.isSaved(dateString, hour)) return;

      const overDate = { date: dateString, hour };
      if (this.isSelected(dateString, hour))
        return this.unSelectAvailability(overDate);

      this.selectAvailability({ date: dateString, hour });
    },
    selectDay(dateString: DateString) {
      const date = AvailabilityDate.init({ date: dateString, hour: 0 });
      if (this.isAllDaySelected(date)) {
        return this.unSelectAvailabilities(dateString);
      }

      this.selectAvailabilities(dateString);
    },
    selectAvailability(date: InitOverDate) {
      const charisma = this.getAssociatedCharisma(date.date, date.hour);
      const selection = { date, charisma };

      this.$accessor.volunteerAvailability.selectAvailability(selection);
    },
    selectAvailabilities(date: DateString) {
      ALL_HOURS.filter((hour) => !this.isAvailableOn(date, hour)).map(
        (hour) => {
          const overDate = { date, hour };
          this.selectAvailability(overDate);
        },
      );
    },
    getPeriodDurationInHours(hour: Hour): number {
      return this.isPartyShift(hour) ? 1 : 2;
    },
    unSelectAvailability(date: InitOverDate) {
      const charisma = this.getAssociatedCharisma(date.date, date.hour);
      const selection = { date, charisma };

      this.$accessor.volunteerAvailability.unSelectAvailability(selection);
    },
    unSelectAvailabilities(date: DateString) {
      ALL_HOURS.filter((hour) => this.isSelected(date, hour)).map((hour) => {
        const overDate = { date, hour };
        this.unSelectAvailability(overDate);
      });
    },

    getAssociatedCharisma(date: DateString, hour: Hour): number {
      const { period } = AvailabilityDate.init({ date, hour });
      return getPeriodCharisma(this.charismaPeriods, period);
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
