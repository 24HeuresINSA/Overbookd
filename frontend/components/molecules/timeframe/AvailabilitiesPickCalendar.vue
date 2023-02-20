<template>
  <div>
    <OverCalendarV2
      :date="period.start"
      :weekdays="weekdayNumbers"
      class="no-scroll elevation-2"
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
            locked: isLocked(date, hour),
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
    isSelected(): (date: string, hour: number) => boolean {
      return (date: string, hour: number) => {
        return this.isInPeriodArray(date, hour, this.selected);
      };
    },
    isLocked(): (date: string, hour: number) => boolean {
      return (date: string, hour: number) => {
        return this.isInPeriodArray(date, hour, this.savedAvailabilities);
      };
    },
    weekdayNumbers(): Number[] {
      return this.generateWeekdayList([], new Date(this.period.start));
    },
  },
  methods: {
    isInPeriodArray(date: string, hour: number, periods: Period[]): boolean {
      return periods.some(
        (period) =>
          period.start.getDate() === new Date(date).getDate() &&
          period.start.getHours() === hour
      );
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
      if (this.isLocked(date, hour)) return;
      if (this.isSelected(date, hour)) return this.removePeriod(date, hour);
      this.addPeriod(date, time, hour);
    },
    addPeriod(date: string, time: string, hour: number) {
      const periodToAdd = this.generateNewPeriod(date, time, hour);
      this.selected = [...this.selected, periodToAdd];
    },
    generateNewPeriod(date: string, time: string, hour: number): Period {
      const durationInHours = this.isPartyShift(hour) ? 1 : 2;
      const start = new Date(`${date} ${time}`);
      let end = new Date(start);
      end.setHours(hour + durationInHours);
      return { start, end };
    },
    removePeriod(date: string, hour: number) {
      this.selected = this.selected.filter(
        (period) =>
          period.start.getDate() !== new Date(date).getDate() ||
          period.start.getHours() !== hour
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
      if (!this.isPartyShift(hour)) return charisma * 2;
      return charisma;
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

.locked {
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
