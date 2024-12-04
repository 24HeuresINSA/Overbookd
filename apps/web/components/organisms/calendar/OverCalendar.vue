<template>
  <div
    v-touch="{
      left: moveToNextWeekOrDay,
      right: moveToPreviousWeekOrDay,
    }"
    class="calendar-with-manager"
  >
    <CalendarManager
      v-model="displayedDay"
      :day-mode="isDayMode"
      @previous="moveToPreviousWeekOrDay"
      @next="moveToNextWeekOrDay"
    />
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
          :class="getShiftDelimiterClass(hour)"
        />
      </div>

      <div class="calendar-content">
        <DailyCalendarContent
          v-if="isDayMode"
          v-model:hovered-event-id="hoveredEventId"
          :events="events"
          :displayed-day="displayedDay"
          :clickable-events="clickableEvents"
          @event-click="propagateEventClick"
        />
        <WeeklyCalendarContent
          v-else
          v-model:hovered-event-id="hoveredEventId"
          :events="events"
          :displayed-day="displayedDay"
          :clickable-events="clickableEvents"
          @event-click="propagateEventClick"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  formatDateNumberValue,
  HOURS_IN_DAY,
  ONE_DAY_IN_MS,
  ONE_WEEK_IN_MS,
} from "@overbookd/time";
import { DAY_MODE, type CalendarMode } from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";
import { SHIFT_HOURS } from "~/utils/shift";

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
  clickableEvents: {
    type: Boolean,
    default: false,
  },
});

const displayedDay = defineModel<Date>({ default: new Date() });
const isDayMode = computed<boolean>(() =>
  props.mode ? props.mode === DAY_MODE : layoutStore.isMobile,
);

const shiftDelimiterMap = new Map<number, string>([
  [SHIFT_HOURS.DAY, "day-start"],
  [SHIFT_HOURS.DAY - 1, "day-end"],
  [SHIFT_HOURS.PARTY, "party-start"],
  [SHIFT_HOURS.PARTY - 1, "party-end"],
  [SHIFT_HOURS.NIGHT, "night-start"],
  [SHIFT_HOURS.NIGHT - 1, "night-end"],
]);
const getShiftDelimiterClass = (hour: number): string => {
  return shiftDelimiterMap.get(hour) || "";
};

const moveToPreviousWeekOrDay = () => {
  displayedDay.value = isDayMode.value
    ? new Date(displayedDay.value.getTime() - ONE_DAY_IN_MS)
    : new Date(displayedDay.value.getTime() - ONE_WEEK_IN_MS);
};
const moveToNextWeekOrDay = () => {
  displayedDay.value = isDayMode.value
    ? new Date(displayedDay.value.getTime() + ONE_DAY_IN_MS)
    : new Date(displayedDay.value.getTime() + ONE_WEEK_IN_MS);
};

if (publicHolidayStore.all.length === 0) {
  publicHolidayStore.fetchAll();
}

const hoveredEventId = ref<string | undefined>();

const emit = defineEmits(["event-click"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("event-click", event);
};
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

  .day-start {
    border-top: 2px solid rgba(var(--v-theme-secondary), 0.8);
  }
  .night-start {
    border-top: 2px solid rgba(var(--v-theme-primary), 0.8);
  }
  .party-start {
    border-top: 2px solid rgba(var(--v-theme-tertiary), 0.8);
  }
  .day-end {
    border-bottom: 2px solid rgba(var(--v-theme-secondary), 0.8);
  }
  .night-end {
    border-bottom: 2px solid rgba(var(--v-theme-primary), 0.8);
  }
  .party-end {
    border-bottom: 2px solid rgba(var(--v-theme-tertiary), 0.8);
  }
}

.calendar-content {
  width: 100%;
  height: 100%;
  grid-row: 2;
  grid-column: 2;
}
</style>
