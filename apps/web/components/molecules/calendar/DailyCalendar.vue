<template>
  <div class="daily-calendar">
    <DailyCalendarHeader v-model="currentDay" />

    <div class="calendar-time">
      <div v-for="hour in HOURS_IN_DAY" :key="hour" class="calendar-time__hour">
        <p class="hour-indicator">{{ formatDateNumberValue(hour) }}:00</p>
      </div>
    </div>

    <div class="calendar-content">
      <div
        v-for="hour in HOURS_IN_DAY"
        :key="hour"
        class="calendar-content__hour"
      />

      <CalendarEvent
        v-for="event in events"
        v-show="isEventInDay(event)"
        :key="event.name"
        :event="event"
        :current-day="currentDay"
        :overlapping-events="getOverlappingEvents(event)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Period, HOURS_IN_DAY } from "@overbookd/time";
import { formatDateNumberValue } from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
});

const currentDay = ref<Date>(new Date());

const isEventInDay = (event: CalendarEvent) => {
  const startDate = currentDay.value.toDateString();
  const isSameStartDay = event.start.toDateString() === startDate;
  const isInEndDay = event.end.toDateString() === startDate;
  return isSameStartDay || isInEndDay;
};

const getOverlappingEvents = (event: CalendarEvent) => {
  const eventPeriod = Period.init(event);
  return props.events.filter((e) => Period.init(e).isOverlapping(eventPeriod));
};
</script>

<style lang="scss" scoped>
@import "./calendar.scss";

$hour-height: 45px;

.daily-calendar {
  width: 100%;
  min-width: 300px;
  display: grid;
  grid-template-columns: 60px 1fr;
  align-items: center;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-on-surface));
  border-radius: $calendar-radius;
  padding-bottom: 1px;
}

.calendar-time {
  height: $hour-height * 24;
  width: 60px;
  grid-row: 2;
  grid-column: 1;
  border-bottom-left-radius: $calendar-radius;
  border-top: 1px solid rgb(var(--v-theme-on-surface));

  &__hour {
    height: $hour-height;
    display: flex;
    justify-content: end;
    align-items: end;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 1px;
      background-color: rgba(var(--v-theme-on-surface), 0.2);
    }
    &:first-child::after {
      content: none;
    }

    .hour-indicator {
      position: relative;
      font-size: 0.8rem;
      color: rgba(var(--v-theme-on-surface), 0.8);
      margin-right: 15px;
      bottom: -10px;
    }
    &:last-child .hour-indicator {
      display: none;
    }
  }
}

.calendar-content {
  position: relative;
  height: $hour-height * 24;
  grid-row: 2;
  grid-column: 2;
  border-bottom-right-radius: $calendar-radius;
  border-top: 1px solid rgb(var(--v-theme-on-surface));
  border-left: 1px solid rgb(var(--v-theme-on-surface));

  &__hour {
    height: $hour-height;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    &:first-child {
      border-top: none;
    }
  }
}
</style>
