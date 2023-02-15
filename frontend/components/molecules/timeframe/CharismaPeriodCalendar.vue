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
    <OverCalendarV2
      v-model="calendarMarker"
      :events="calendarEvents"
    ></OverCalendarV2>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { formatDateWithExplicitMonth } from "~/utils/date/dateUtils";
import { SavedCharismaPeriod } from "~/utils/models/charismaPeriod";

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
  components: { OverCalendarV2 },
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
    getCharismaColor(charisma: number) {
      const { red, blue, green } = this.getCharismaColorLevels(charisma);
      return `rgb(${red}, ${green}, ${blue})`;
    },
    previousPage() {
      const calendar = this.$refs.calendar as any;
      if (calendar) calendar.prev();
    },
    nextPage() {
      const calendar = this.$refs.calendar as any;
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
</style>
