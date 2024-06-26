<template>
  <div>
    <OverCalendar
      v-model="calendarMarker"
      :events="calendarEvents"
      :title="calendarTitle"
    ></OverCalendar>
  </div>
</template>

<script lang="ts">
import { SavedCharismaPeriod } from "@overbookd/http";
import Vue from "vue";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import { formatDateWithExplicitMonth } from "~/utils/date/date.utils";
import { CalendarEvent } from "~/utils/calendar/event";

const PRIMARY_COLOR = {
  RED_LEVEL: 33,
  GREEN_LEVEL: 150,
  BLUE_LEVEL: 243,
};

export default Vue.extend({
  name: "CharismaPeriodCalendar",
  components: { OverCalendar },
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
    calendarEvents(): CalendarEvent[] {
      return this.charismaPeriods.map((a) => ({
        start: a.start,
        end: a.end,
        name: a.charisma.toString(),
        color: this.getCharismaColor(a.charisma),
        timed: true,
      }));
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    maxCharisma(): number {
      return Math.max(...this.charismaPeriods.map((a) => a.charisma));
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
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
  },
});
</script>
