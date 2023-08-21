<template>
  <div class="over-multi-calendar">
    <div class="date-navigation">
      <v-btn icon @click="previousDay">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon @click="nextDay">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
    <v-calendar
      ref="calendar"
      :value="startDate"
      type="category"
      category-show-all
      :categories="volunteerIds"
      :events="events"
      :interval-height="24"
      class="calendar"
      @input="updateDate"
    >
      <template #category="{ category }">
        <slot :category="category" name="volunteer-header">
          <div class="volunteer-header">
            <NeedHelpVolunteerResumeCalendarHeader
              v-if="retrieveVolunteer(+category)"
              :volunteer="retrieveVolunteer(+category)"
              class="volunteer-resume"
            ></NeedHelpVolunteerResumeCalendarHeader>
          </div>
        </slot>
      </template>
      <template
        #interval="{
          date,
          category,
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
          :date="date"
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
        >
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
          <div
            :class="{
              available: isVolunteerAvailable(date, time, +category),
            }"
          ></div>
        </slot>
      </template>
    </v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PlanningEvent } from "~/domain/common/planning-events";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { computeNextHourDate } from "~/utils/date/dateUtils";
import { CalendarEvent, CalendarUser } from "~/utils/models/calendar";
import { SHIFT_HOURS } from "~/utils/shift/shift";
import NeedHelpVolunteerResumeCalendarHeader from "../need-help/NeedHelpVolunteerResumeCalendarHeader.vue";
import { VuetifyCalendar } from "~/utils/calendar/vuetify-calendar";

export default Vue.extend({
  name: "OverMultiCalendar",
  components: { NeedHelpVolunteerResumeCalendarHeader },
  model: {
    prop: "startDate",
    event: "change",
  },
  props: {
    users: {
      type: Array as () => CalendarUser[],
      required: true,
      default: () => [],
    },
    planningEvents: {
      type: Array as () => PlanningEvent[],
      required: true,
      default: () => [],
    },
    eventToAdd: {
      type: Object as () => PlanningEvent | undefined,
      default: () => undefined as PlanningEvent | undefined,
    },
    startDate: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  computed: {
    volunteerIds(): string[] {
      return this.users.map(({ id }) => id.toString());
    },
    existingEvents(): CalendarEvent[] {
      return this.planningEvents.map(
        ({ start, end, volunteerId, name, color }) => ({
          start,
          end,
          category: volunteerId?.toString(),
          name,
          color,
          timed: true,
        }),
      );
    },
    previewEvents(): CalendarEvent[] {
      if (!this.eventToAdd) return [];

      return this.buildPreviewEvents(this.eventToAdd);
    },
    events(): CalendarEvent[] {
      return [...this.existingEvents, ...this.previewEvents];
    },
    isDarkTheme(): boolean {
      return this.$accessor.theme.darkTheme;
    },
  },
  methods: {
    updateDate(date: Date) {
      this.$emit("change", date);
    },
    retrieveVolunteer(id: number): CalendarUser | undefined {
      return this.users.find((volunteer) => volunteer.id === id);
    },
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
    isVolunteerAvailable(
      date: string,
      time: string,
      volunteerId: number,
    ): boolean {
      const volunteer = this.retrieveVolunteer(volunteerId);
      if (!volunteer) return false;

      const start = new Date(`${date} ${time}`);
      const end = computeNextHourDate(start);

      return volunteer.availabilities.some(
        isPeriodIncludedByAnother({ start, end }),
      );
    },
    buildPreviewEvents(eventToAdd: PlanningEvent): CalendarEvent[] {
      return this.volunteerIds.map((category) => ({
        ...eventToAdd,
        timed: true,
        category,
      }));
    },
    previousDay() {
      const calendar = this.$refs.calendar as unknown as VuetifyCalendar;
      if (calendar) calendar.prev();
    },
    nextDay() {
      const calendar = this.$refs.calendar as unknown as VuetifyCalendar;
      if (calendar) calendar.next();
    },
  },
});
</script>

<style lang="scss" scoped>
.over-multi-calendar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  .date-navigation {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .calendar {
    width: 100%;
    overflow-y: hidden;

    .volunteer-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
      .volunteer-resume {
        width: 100%;
      }
    }
    .available {
      background-color: $calendar-available-background-color;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
