<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="previousPage()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer class="calendar-title">
        <div>
          {{
            new Date(value).toLocaleString("fr-FR", { month: "long" }) +
            " " +
            new Date(value).getFullYear()
          }}
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
import { time_windows, time_windows_type } from "~/utils/models/FA";
import { FTTimeWindow } from "~/utils/models/ft";

interface CalendarTimeWindow {
  start: string;
  end: string;
  color: string;
  name: string;
}

export default Vue.extend({
  name: "FestivalEventCalendar",
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
    timeWindows: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({
    value: "",
  }),
  computed: {
    calendarTimeWindows(): CalendarTimeWindow[] {
      return this.festivalEvent === "FA"
        ? this.faTimeWindows
        : this.ftTimeWindows;
    },
    faTimeWindows(): CalendarTimeWindow[] {
      return (this.timeWindows as time_windows[]).map((timeWindow) => ({
        start: this.formatDateForCalendar(timeWindow.start),
        end: this.formatDateForCalendar(timeWindow.end),
        color:
          timeWindow.type === time_windows_type.MATOS ? "secondary" : "primary",
        name:
          timeWindow.type === time_windows_type.MATOS
            ? "Utilisation du matos"
            : "Tenue de l'animation",
      }));
    },
    ftTimeWindows(): CalendarTimeWindow[] {
      return (this.timeWindows as FTTimeWindow[]).map((timeWindow) => ({
        start: this.formatDateForCalendar(timeWindow.start),
        end: this.formatDateForCalendar(timeWindow.end),
        color: "primary",
        name: "Créneau",
      }));
    },
  },
  mounted() {
    this.value = this.$accessor.config.getConfig("event_date");
  },
  methods: {
    formatDateForCalendar(date: Date): string {
      date = new Date(date);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    },
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
