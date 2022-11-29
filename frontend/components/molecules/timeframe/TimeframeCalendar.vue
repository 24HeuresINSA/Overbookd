<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.formCalendar.prev()">
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
      <v-btn icon class="ma-2" @click="$refs.formCalendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="formCalendar"
      v-model="value"
      type="week"
      color="primary"
      :events="events"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :event-ripple="false"
      event-name="plage"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

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
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
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
