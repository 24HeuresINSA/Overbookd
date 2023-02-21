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
      <template #interval="{ date, hour, time }">
        <div
          v-if="isEndOfPeriod(hour)"
          class="event"
          :class="{
            'two-hours': !isPartyShift(hour),
            'one-hour': isPartyShift(hour),
            selected: isSelected(date, hour),
            saved: isSaved(date, hour),
          }"
          @click="selectPeriod(date, hour, time)"
        >
          {{ getDisplayedCharisma(date, hour, time) }}
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
      const dayAndNightHours = SHIFT_HOURS.PARTY - SHIFT_HOURS.NIGHT;
      return 24 - dayAndNightHours / 2;
    },
    isSelected(): (date: string, hour: number) => boolean {
      return (date: string, hour: number) =>
        this.selected.some(this.isSamePeriod(date, hour));
    },
    isAllPeriodsInDaySelected(): (date: string) => boolean {
      return (date: string) => {
        const selectedDayPeriods = this.selected.filter(
          (period) => period.start.getDate() === new Date(date).getDate()
        );
        return selectedDayPeriods.length === this.periodsInDay;
      };
    },
    isSaved(): (date: string, hour: number) => boolean {
      return (date: string, hour: number) =>
        this.savedAvailabilities.some(this.isSamePeriod(date, hour));
    },
    isSelectedOrSaved(): (date: string, hour: number) => boolean {
      return (date: string, hour: number) =>
        this.isSelected(date, hour) || this.isSaved(date, hour);
    },
    weekdayNumbers(): Number[] {
      return this.generateWeekdayList([], new Date(this.period.start));
    },
  },
  methods: {
    isSamePeriod(date: string, hour: number): (value: Period) => boolean {
      return (period) =>
        period.start.getDate() === new Date(date).getDate() &&
        period.start.getHours() === hour;
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
    selectPeriod(date: string, hour: number, time: string) {
      if (this.isSaved(date, hour)) return;
      if (this.isSelected(date, hour)) return this.removePeriod(date, hour);
      this.addPeriod(date, time, hour);
    },
    selectDay(date: string) {
      if (this.isAllPeriodsInDaySelected(date))
        return this.removePeriodsInDay(date);
      this.addPeriodsInDay(date);
    },
    addPeriod(date: string, time: string, hour: number) {
      const periodToAdd = this.generateNewPeriod(date, time, hour);
      this.selected = [...this.selected, periodToAdd];
    },
    addPeriodsInDay(date: string) {
      const periods = this.generatePeriodsInDay(date);
      this.selected = [...this.selected, ...periods];
    },
    getPeriodDurationInHours(hour: number): number {
      return this.isPartyShift(hour) ? 1 : 2;
    },
    generateNewPeriod(date: string, time: string, hour: number): Period {
      const durationInHours = this.getPeriodDurationInHours(hour);
      const start = new Date(`${date} ${time}`);
      const end = new Date(start);
      end.setHours(hour + durationInHours);
      return { start, end };
    },
    generatePeriodsInDay(date: string): Period[] {
      const periods = [];
      let time = "00:00";
      for (let hour = 0; hour < 24; hour++) {
        if (this.isSelectedOrSaved(date, hour) || !this.isEndOfPeriod(hour))
          continue;

        time = `${hour}:00`;
        const newPeriod = this.generateNewPeriod(date, time, hour);
        periods.push(newPeriod);
      }
      return periods;
    },
    removePeriod(date: string, hour: number) {
      this.selected = this.selected.filter(
        (period) => !this.isSamePeriod(date, hour)(period)
      );
    },
    removePeriodsInDay(date: string) {
      this.selected = this.selected.filter(
        (period) => period.start.getDate() !== new Date(date).getDate()
      );
    },
    getCharismaByDate(date: string, time: string): number {
      const charismaPeriods =
        this.$accessor.charismaPeriod.charismaPeriods ?? [];
      const validDate = new Date(`${date} ${time}`);
      return getCharismaByDate(charismaPeriods, validDate);
    },
    getDisplayedCharisma(date: string, hour: number, time: string): number {
      const charisma = this.getCharismaByDate(date, time);
      return charisma * this.getPeriodDurationInHours(hour);
    },
    formatDateDay(date: string): string {
      return new Date(date).toLocaleDateString("fr-FR", { weekday: "short" });
    },
    formatDateDayNumber(date: string): string {
      return new Date(date).toLocaleDateString("fr-FR", { day: "numeric" });
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
