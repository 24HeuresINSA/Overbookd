<template>
  <div>
    <OverCalendarV2
      :date="period.start"
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
          }"
          @click="selectPeriod(date, hour)"
        >
          {{ getDisplayedCharisma(date, hour) }}
        </div>
      </template>
    </OverCalendarV2>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { getCharismaByDate } from "~/utils/models/charismaPeriod";
import { Period } from "~/utils/models/period";
import { SHIFT_HOURS } from "~/utils/shift/shift";

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
  data: () => ({
    selected: [] as Period[],
  }),
  computed: {
    savedAvailabilities(): Period[] {
      // return this.$accessor.volunteerAvailabilities.registeredAvailabilities;
      return [];
    },
    periodsInDay(): number {
      const dayAndNightShiftsDurationHours =
        SHIFT_HOURS.PARTY - SHIFT_HOURS.NIGHT;
      const nightShiftDurationHours =
        24 - SHIFT_HOURS.PARTY + SHIFT_HOURS.NIGHT;
      return nightShiftDurationHours + dayAndNightShiftsDurationHours / 2;
    },
    isSelected(): (date: string | Date, hour: number) => boolean {
      return (date: string | Date, hour: number) =>
        this.selected.some(
          this.isSamePeriod(this.updateDateWithHour(new Date(date), hour))
        );
    },
    isAllPeriodsInDaySelected(): (date: Date) => boolean {
      return (date: Date) => {
        const selectedDayPeriods = this.selected.filter(
          (period) => period.start.getDate() === date.getDate()
        );
        return selectedDayPeriods.length === this.periodsInDay;
      };
    },
    isSaved(): (date: string | Date, hour: number) => boolean {
      return (date: string | Date, hour: number) =>
        this.savedAvailabilities.some(
          this.isSamePeriod(this.updateDateWithHour(new Date(date), hour))
        );
    },
    isSelectedOrSaved(): (date: string | Date, hour: number) => boolean {
      return (date: string | Date, hour: number) =>
        this.isSelected(date, hour) || this.isSaved(date, hour);
    },
    weekdayNumbers(): Number[] {
      return this.generateWeekdayList([], new Date(this.period.start));
    },
  },
  methods: {
    isSamePeriod(date: Date): (value: Period) => boolean {
      return (period) =>
        period.start.getDate() === date.getDate() &&
        period.start.getHours() === date.getHours();
    },
    isPartyShift(hour: number): boolean {
      return hour >= SHIFT_HOURS.PARTY || hour < SHIFT_HOURS.NIGHT;
    },
    isEndOfPeriod(hour: number): boolean {
      return this.isPartyShift(hour) || hour % 2 === 0;
    },
    generateWeekdayList(weekdays: number[], date: Date): number[] {
      if (date > this.period.end) return weekdays;
      const weekday = date.getDay();
      const tomorrow = new Date(date);
      tomorrow.setDate(date.getDate() + 1);
      return this.generateWeekdayList([...weekdays, weekday], tomorrow);
    },
    selectPeriod(dateString: string, hour: number) {
      const date = new Date(dateString);
      if (this.isSaved(date, hour)) return;

      const updatedDate = this.updateDateWithHour(new Date(date), hour);
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
      const periodToAdd = this.generateNewPeriod(date);
      this.selected = [...this.selected, periodToAdd];
    },
    addPeriodsInDay(date: Date) {
      const periods = this.generateAllPeriodsFor(date);
      this.selected = [...this.selected, ...periods];
    },
    getPeriodDurationInHours(hour: number): number {
      return this.isPartyShift(hour) ? 1 : 2;
    },
    generateNewPeriod(date: Date): Period {
      const durationInHours = this.getPeriodDurationInHours(date.getHours());
      const start = new Date(date);
      const end = new Date(start);
      end.setHours(date.getHours() + durationInHours);
      return { start, end };
    },
    generateAllPeriodsFor(dayDate: Date): Period[] {
      const periods = [];
      for (let hour = 0; hour < 24; hour++) {
        if (this.isSelectedOrSaved(dayDate, hour) || !this.isEndOfPeriod(hour))
          continue;

        const newPeriod = this.generateNewPeriod(
          this.updateDateWithHour(dayDate, hour)
        );
        periods.push(newPeriod);
      }
      return periods;
    },
    removePeriod(date: Date) {
      this.selected = this.selected.filter(
        (period) => !this.isSamePeriod(date)(period)
      );
    },
    removePeriodsInDay(date: Date) {
      this.selected = this.selected.filter(
        (period) => period.start.getDate() !== date.getDate()
      );
    },
    getCharismaByDate(date: Date): number {
      const charismaPeriods =
        this.$accessor.charismaPeriod.charismaPeriods ?? [];
      return getCharismaByDate(charismaPeriods, date);
    },
    getDisplayedCharisma(date: string, hour: number): number {
      const charisma = this.getCharismaByDate(
        this.updateDateWithHour(new Date(date), hour)
      );
      return charisma * this.getPeriodDurationInHours(hour);
    },
    formatDateDay(dateString: string): string {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        weekday: "short",
      });
    },
    formatDateDayNumber(dateString: string): string {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        day: "numeric",
      });
    },
    updateDateWithHour(date: Date, hour: number): Date {
      return new Date(new Date(date.setHours(hour)).setMinutes(0));
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

/* Hover only on computer but not with touchscreen */
@media (hover: hover) and (pointer: fine) {
  .event:hover {
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
