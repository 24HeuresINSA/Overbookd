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
      v-model="value"
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

interface CalendarAvailability {
  start: Date;
  end: Date;
  name: string;
  color: string;
  timed: true;
}

export default Vue.extend({
  name: "AvailabilitiesCreationCalendar",
  data: () => ({
    value: new Date(),
  }),
  computed: {
    availabilities(): any[] {
      // TODO: call store
      return [
        {
          start: new Date("2023-05-12 22:00"),
          end: new Date("2023-05-13 02:00"),
          charisma: 10,
        },
        {
          start: new Date("2023-05-11 00:00"),
          end: new Date("2023-05-12 20:00"),
          charisma: 5,
        },
        {
          start: new Date("2023-05-10 00:00"),
          end: new Date("2023-05-10 20:00"),
          charisma: 1,
        },
      ];
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.value);
    },
    calendarEvents(): CalendarAvailability[] {
      return this.availabilities.map((a) => ({
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
      return Math.max(...this.availabilities.map((a) => a.charisma));
    },
  },
  mounted() {
    this.value = this.manifDate;
  },
  methods: {
    getCharismaColor(charisma: number) {
      const ratio = charisma / this.maxCharisma;
      const red = Math.round(ratio * (33 - 255) + 255);
      const green = Math.round(ratio * (150 - 255) + 255);
      const blue = Math.round(ratio * (243 - 255) + 255);
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
