<template>
  <div>
    <div
      v-for="calendarType in types"
      :key="calendarType"
      class="calendar"
      :class="`calendar-${calendarType}`"
    >
      <v-sheet v-if="displayHeader" tile height="54" class="d-flex">
        <v-btn
          icon
          class="ma-2"
          :disabled="disablePrevious"
          @click="previousPage(calendarType)"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer class="calendar-title">
          <slot name="title">
            <div>
              {{ title ?? defaultTitle }}
            </div>
          </slot>
        </v-spacer>
        <v-btn
          icon
          class="ma-2"
          :disabled="disableNext"
          @click="nextPage(calendarType)"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <v-calendar
        :ref="`calendar-${calendarType}`"
        :value="date"
        :type="calendarType"
        :events="eventsWithHolyDays"
        :event-ripple="true"
        :weekdays="weekdays"
        @click:date="selectDate"
        @moved="updateDate"
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
            <nuxt-link :to="event.link ?? ''" class="calendar-event">
              <div class="default-event">
                <component :is="{ render: eventSummary }" />
              </div>
            </nuxt-link>
          </slot>
        </template>
      </v-calendar>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DateString, OverDate } from "@overbookd/period";
import { SHIFT_HOURS } from "@overbookd/volunteer-availability";
import { CalendarEvent } from "~/utils/models/calendar.model";
import {
  VuetifyCalendar,
  VuetifyCalendarType,
} from "~/utils/calendar/vuetify-calendar";
import { formatMonthWithYear } from "~/utils/date/date.utils";
import { HolyDay } from "~/store/holyday";

export default defineComponent({
  name: "OverCalendar",
  model: {
    prop: "date",
    event: "update:date",
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
    disablePrevious: {
      type: Boolean,
      default: false,
    },
    disableNext: {
      type: Boolean,
      default: false,
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
  emits: ["update:date", "select:date"],
  computed: {
    eventsWithHolyDays(): CalendarEvent[] {
      return [...this.events, ...this.holyDayEvents];
    },
    isDarkTheme(): boolean {
      return this.$accessor.theme.darkTheme;
    },
    defaultTitle(): string {
      return formatMonthWithYear(this.date);
    },
    types(): VuetifyCalendarType[] {
      return ["day", "week"];
    },
    holyDays(): HolyDay[] {
      return this.$accessor.holyday.days;
    },
    holyDayEvents(): CalendarEvent[] {
      return this.holyDays.map((holyDay) => ({
        start: holyDay.date,
        name: holyDay.name,
        timed: false,
        color: "grey",
      }));
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
  async mounted() {
    if (this.holyDays.length === 0) {
      await this.$accessor.holyday.fetchHolyDays();
    }
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
    updateDate({ date }: { date: DateString }) {
      const newDate = OverDate.init({ date, hour: 0 }).date;
      this.$emit("update:date", newDate);
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
    selectDate({ date }: { date: DateString }) {
      this.$emit("select:date", date);
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
  &-event {
    color: unset;
    &:visited {
      color: unset;
    }
    display: block;
    min-height: 100%;
  }
}
.default-event {
  padding-left: 4px;
}
</style>
