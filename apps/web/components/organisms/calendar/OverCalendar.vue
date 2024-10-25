<template>
  <div class="calendar-with-manager">
    <CalendarManager v-model="displayedDay" :day-mode="isDayMode" />
    <div class="calendar" :class="{ 'daily-calendar': isDayMode }">
      <div class="empty-case" />
      <header class="calendar-header">
        <DailyCalendarHeader v-show="isDayMode" :displayed-day="displayedDay" />
        <WeeklyCalendarHeader
          v-show="!isDayMode"
          :displayed-day="displayedDay"
        />
      </header>

      <div class="calendar-time">
        <div
          v-for="hour in HOURS_IN_DAY"
          :key="hour"
          class="calendar-time__hour"
        >
          <p class="hour-indicator">{{ formatDateNumberValue(hour) }}:00</p>
        </div>
      </div>

      <div class="calendar-content-rows">
        <div
          v-for="hour in HOURS_IN_DAY"
          :key="hour"
          class="calendar-content-rows__hour"
        />
      </div>

      <div class="calendar-content">
        <DailyCalendarContent
          v-show="isDayMode"
          :events="events"
          :displayed-day="displayedDay"
        />
        <WeeklyCalendarContent
          v-show="!isDayMode"
          :events="events"
          :displayed-day="displayedDay"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HOURS_IN_DAY } from "@overbookd/time";
import {
  DAY_MODE,
  formatDateNumberValue,
  type CalendarMode,
} from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";

const publicHolidayStore = usePublicHolidayStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    default: () => [],
  },
  mode: {
    type: String as PropType<CalendarMode | undefined>,
    default: undefined,
  },
});

const displayedDay = defineModel<Date>({ default: new Date() });
const isDayMode = computed<boolean>(() =>
  props.mode ? props.mode === DAY_MODE : layoutStore.isMobile,
);

if (publicHolidayStore.all.length === 0) {
  publicHolidayStore.fetchAll();
}
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

$hour-height: 45px;
$first-column-width: 60px;
$calendar-content-height: $hour-height * 24;

.calendar-with-manager {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.calendar {
  width: 100%;
  min-width: $calendar-day-min-width * 7 + $first-column-width + 2px;
  display: grid;
  grid-template-columns: $first-column-width 1fr;
  align-items: center;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-on-surface));
  border-radius: $calendar-radius;
  padding-bottom: 1px;
}
.daily-calendar {
  min-width: $first-column-width + $calendar-day-min-width + 2px;
}

.empty-case {
  grid-row: 1;
  grid-column: 1;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface));
  border-right: 1px solid rgb(var(--v-theme-on-surface));
  height: 100%;
}

.calendar-header {
  width: 100%;
  grid-row: 1;
  grid-column: 2;
  border-top-right-radius: $calendar-radius;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface));
}

.calendar-time {
  height: $calendar-content-height;
  width: 60px;
  grid-row: 2;
  grid-column: 1;
  border-bottom-left-radius: $calendar-radius;
  border-right: 1px solid rgb(var(--v-theme-on-surface));

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

.calendar-content-rows {
  position: relative;
  height: $calendar-content-height;
  grid-row: 2;
  grid-column: 2;
  border-bottom-right-radius: $calendar-radius;

  &__hour {
    height: $hour-height;
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    &:first-child {
      border-top: none;
    }
  }
}

.calendar-content {
  width: 100%;
  height: 100%;
  grid-row: 2;
  grid-column: 2;
}
</style>
