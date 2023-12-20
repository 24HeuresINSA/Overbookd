<template>
  <div>
    <div
      v-for="calendarType in types"
      :key="calendarType"
      class="calendar"
      :class="`calendar-${calendarType}`"
    >
      <v-sheet v-if="displayHeader" tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="previousPage(calendarType)">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer class="calendar-title">
          <slot name="title">
            <div>
              {{ title ?? defaultTitle }}
            </div>
          </slot>
        </v-spacer>
        <v-btn icon class="ma-2" @click="nextPage(calendarType)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <v-calendar
        :ref="`calendar-${calendarType}`"
        :value="date"
        :type="calendarType"
        :events="events"
        :event-ripple="true"
        :weekdays="weekdays"
        @input="updateDate"
      >
        <template
          #interval="{
            date: intervalDate,
            year,
            mounth,
            day,
            hour,
            minute,
            weekday,
            hasDay,
            hasTime,
            past,
            present,
            future,
            time,
            timeToY,
            timeDelta,
            minutesToPixels,
            week,
          }"
        >
          <slot
            name="interval"
            :date="intervalDate"
            :year="year"
            :mounth="mounth"
            :day="day"
            :hour="hour"
            :minute="minute"
            :weekday="weekday"
            :hasDay="hasDay"
            :hasTime="hasTime"
            :past="past"
            :present="present"
            :future="future"
            :time="time"
            :timeToY="timeToY"
            :timeDelta="timeDelta"
            :minutesToPixels="minutesToPixels"
            :week="week"
          ></slot>
          <div
            :class="{
              shift: isShiftHour(hour),
              'shift-party': isPartyHour(hour),
              'shift-day': isDayHour(hour),
              'shift-night': isNightHour(hour),
              'theme--dark': isDarkTheme,
            }"
            :style="{ top: `calc(${timeToY(time)}px - 2px)` }"
          ></div>
        </template>
        <template
          #event="{
            event,
            eventParsed,
            day,
            outside,
            start,
            end,
            timed,
            singleline,
            overlapsNoon,
            formatTime,
            timeSummary,
            eventSummary,
          }"
        >
          <slot
            name="event"
            :event="event"
            :eventParsed="eventParsed"
            :day="day"
            :outside="outside"
            :start="start"
            :end="end"
            :timed="timed"
            :singleline="singleline"
            :overlapsNoon="overlapsNoon"
            :formatTime="formatTime"
            :timeSummary="timeSummary"
            :eventSummary="eventSummary"
          >
            <div class="default-event">
              <component :is="{ render: eventSummary }" />
            </div>
          </slot>
        </template>
      </v-calendar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { SHIFT_HOURS } from "~/utils/shift/shift";
import {
  VuetifyCalendar,
  VuetifyCalendarType,
} from "~/utils/calendar/vuetify-calendar";
import { formatMonthWithYear } from "~/utils/date/date.utils";

export default Vue.extend({
  name: "OverCalendar",
  model: {
    prop: "date",
    event: "change",
  },
  props: {
    events: {
      type: Array as () => CalendarEvent[],
      default: () => [],
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    displayHeader: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: () => undefined,
    },
    weekdays: {
      type: Array,
      default: () => [1, 2, 3, 4, 5, 6, 0],
    },
    hourToScrollTo: {
      type: Number,
      default: null,
    },
  },
  computed: {
    isDarkTheme(): boolean {
      return this.$accessor.theme.darkTheme;
    },
    defaultTitle(): string {
      return formatMonthWithYear(this.date);
    },
    types(): VuetifyCalendarType[] {
      return ["day", "week"];
    },
  },
  watch: {
    hourToScrollTo() {
      if (this.hourToScrollTo === null) return;
      const time = `${this.hourToScrollTo}:00`;
      const calendar = this.$refs.calendar as unknown as VuetifyCalendar;
      if (calendar) calendar.scrollToTime(time);
    },
  },
  methods: {
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
    updateDate(date: Date) {
      this.$emit("change", date);
    },
    previousPage(calendarType: VuetifyCalendarType) {
      const calendarReferences = this.$refs[`calendar-${calendarType}`];
      const [calendar] = calendarReferences as unknown as [VuetifyCalendar];
      if (calendar) calendar.prev();
    },
    nextPage(calendarType: VuetifyCalendarType) {
      const calendarReferences = this.$refs[`calendar-${calendarType}`];
      const [calendar] = calendarReferences as unknown as [VuetifyCalendar];
      if (calendar) calendar.next();
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar {
  &-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 500;
  }
  &-day {
    display: none;
    @media only screen and (max-width: $mobile-max-width) {
      display: inherit;
    }
  }
  &-week {
    @media only screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
}
.default-event {
  padding-left: 4px;
}
</style>
