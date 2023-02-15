<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="previousPage">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer class="calendar-title">
        <div>
          {{ calendarTitle }}
        </div>
      </v-spacer>
      <v-btn icon class="ma-2" @click="nextPage">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="formCalendar"
      v-model="calendarMarker"
      type="week"
      :events="calendarEvents"
      :event-ripple="true"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    >
      <template #interval="{ hour, time, timeToY }">
        <div
          :class="{
            shift: isShiftHour(hour),
            'shift-party': isPartyHour(hour),
            'shift-day': isDayHour(hour),
            'shift-night': isNightHour(hour),
          }"
          :style="{ top: timeToY(time) }"
        ></div>
      </template>
    </v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithExplicitMonth } from "~/utils/date/dateUtils";
import { SavedCharismaPeriod } from "~/utils/models/charismaPeriod";
import { SHIFT_HOURS } from "~/utils/shift/shift";

interface CalendarItem {
  start: Date;
  end: Date;
  name: string;
  color: string;
  timed: true;
}

const PRIMARY_COLOR = {
  RED_LEVEL: 33,
  GREEN_LEVEL: 150,
  BLUE_LEVEL: 243,
};

export default Vue.extend({
  name: "CharismaPeriodCalendar",
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    charismaPeriods(): SavedCharismaPeriod[] {
      return this.$accessor.charismaPeriod.charismaPeriods;
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.calendarMarker);
    },
    calendarEvents(): CalendarItem[] {
      return this.charismaPeriods.map((a) => ({
        start: a.start,
        end: a.end,
        name: a.charisma.toString(),
        color: this.getCharismaColor(a.charisma),
        timed: true,
      }));
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    maxCharisma(): number {
      return Math.max(...this.charismaPeriods.map((a) => a.charisma));
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  methods: {
    getCharismaColorLevels(charisma: number): {
      red: number;
      blue: number;
      green: number;
    } {
      const ratio = this.maxCharisma === 0 ? 0 : charisma / this.maxCharisma;
      return {
        red: this.lightenColor(PRIMARY_COLOR.RED_LEVEL, ratio),
        blue: this.lightenColor(PRIMARY_COLOR.BLUE_LEVEL, ratio),
        green: this.lightenColor(PRIMARY_COLOR.GREEN_LEVEL, ratio),
      };
    },
    lightenColor(colorLevel: number, lighterRatio: number): number {
      return Math.round(colorLevel - (colorLevel / 2) * lighterRatio);
    },
    isPartyHour(hour: number): boolean {
      return hour === SHIFT_HOURS.PARTY;
    },
    isDayHour(hour: number): boolean {
      return hour === SHIFT_HOURS.DAY;
    },
    isNightHour(hour: number): boolean {
      return hour === SHIFT_HOURS.NIGHT;
    },
    isShiftHour(hour: number): boolean {
      return (
        this.isDayHour(hour) || this.isNightHour(hour) || this.isPartyHour(hour)
      );
    },
    getCharismaColor(charisma: number) {
      const { red, blue, green } = this.getCharismaColorLevels(charisma);
      return `rgb(${red}, ${green}, ${blue})`;
    },
    previousPage() {
      const calendar = this.$refs.formCalendar as any;
      if (calendar) calendar.prev();
    },
    nextPage() {
      const calendar = this.$refs.formCalendar as any;
      if (calendar) calendar.next();
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}

.shift {
  height: 2px;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;
  &-party {
    background-color: purple;
  }
  &-night {
    background-color: black;
  }
  &-day {
    background-color: darksalmon;
  }
}
</style>
