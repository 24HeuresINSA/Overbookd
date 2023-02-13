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
      :events="availabilities"
      :event-color="getCharismaColor"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithExplicitMonth } from "~/utils/date/dateUtils";

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
          start: new Date(),
          end: new Date(),
          charisma: 5,
        },
      ];
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.value);
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
  },
  mounted() {
    this.value = this.manifDate;
  },
  methods: {
    getCharismaColor({ charisma }: any) {
      const opacity = charisma / 15;
      return `rgba(25, 118, 210, ${opacity})`;
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
