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
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithExplicitMonth } from "~/utils/date/dateUtils";
import { SavedCharismaPeriod } from "~/utils/models/charismaPeriod";

interface CalendarItem {
  start: Date;
  end: Date;
  name: string;
  color: string;
  timed: true;
}

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
    getCharismaColor(charisma: number) {
      const ratio = charisma / this.maxCharisma;
      // primary color is rgb(33, 150, 243)
      const red = Math.round(33 - (33 / 2) * ratio);
      const green = Math.round(150 - (150 / 2) * ratio);
      const blue = Math.round(243 - (243 / 2) * ratio);
      return `rgb(${red}, ${green}, ${blue})`;
    },
    previousPage() {
      const calendar = this.$refs.formCalendar;
      // @ts-ignore
      if (calendar) calendar.prev();
    },
    nextPage() {
      const calendar = this.$refs.formCalendar;
      // @ts-ignore
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
