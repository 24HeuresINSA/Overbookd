<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="previousPage()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer class="calendar-title">
        <div>
          {{ calendarTitle }}
        </div>
      </v-spacer>
      <v-btn icon class="ma-2" @click="nextPage()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="formCalendar"
      v-model="value"
      type="week"
      :events="calendarTimeWindows"
      :event-color="getEventColor"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CalendarItem } from "~/store/calendar";
import { formatDateWithExplicitMonth } from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "FestivalEventCalendar",
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    value: new Date(),
  }),
  computed: {
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.value);
    },
    calendarTimeWindows(): CalendarItem[] {
      return this.festivalEvent === "FA"
        ? this.faTimeWindows
        : this.ftTimeWindows;
    },
    faTimeWindows(): CalendarItem[] {
      const animationTimeWindows: CalendarItem[] = (
        this.$accessor.FA.mFA.time_windows ?? []
      ).map((timeWindow) => ({
        start: timeWindow.start,
        end: timeWindow.end,
        timed: true,
        color: "primary",
        name: "Tenue de l'animation",
      }));

      const gearTimeWindows: CalendarItem[] =
        this.$accessor.FA.gearRequestRentalPeriods.map(
          (gearRequestRentalPeriod) => ({
            start: gearRequestRentalPeriod.start,
            end: gearRequestRentalPeriod.end,
            timed: true,
            color: "secondary",
            name: "Utilisation du matos",
          })
        );

      return [...animationTimeWindows, ...gearTimeWindows];
    },
    ftTimeWindows(): CalendarItem[] {
      return (this.$accessor.FT.mFT.timeWindows ?? []).map((timeWindow) => ({
        start: timeWindow.start,
        end: timeWindow.end,
        timed: true,
        color: "primary",
        name: "Tâche",
      }));
    },
  },
  mounted() {
    this.value = this.manifDate;
  },
  methods: {
    getEventColor(event: any): string {
      return event.color;
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

<style scoped>
.calendar-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}
</style>
