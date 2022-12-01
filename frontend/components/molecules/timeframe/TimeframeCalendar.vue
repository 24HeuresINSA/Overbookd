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
      :events="events"
      :event-color="getEventColor"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      event-name="plage"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { time_windows_type } from "~/utils/models/FA";

export default Vue.extend({
  name: "TimeframeCalendar",
  data: () => ({
    value: "",
  }),
  computed: {
    timeframes(): any {
      return this.$accessor.FA.mFA.time_windows;
    },
    events(): Array<any> {
      let events: Array<any> = [];
      const timeframes = this.$accessor.FA.mFA.time_windows;

      if (!timeframes) return [];
      for (let i = 0; i < timeframes.length; i++) {
        const timeframe = {
          start: this.formatDateForCalendar(timeframes[i].start),
          end: this.formatDateForCalendar(timeframes[i].end),
          color:
            timeframes[i].type == time_windows_type.MATOS
              ? "secondary"
              : "primary",
        };
        events.push(timeframe);
      }
      return events;
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
