<template>
  <div
    v-touch="{
      left: moveToNextWeekOrDay,
      right: moveToPreviousWeekOrDay,
    }"
    class="calendar-with-manager"
  >
    <slot name="manager">
      <CalendarManager
        v-model="day"
        :day-mode="isDayMode"
        @previous="moveToPreviousWeekOrDay"
        @next="moveToNextWeekOrDay"
      >
        <template #additional-actions>
          <slot name="additional-actions" />
        </template>
      </CalendarManager>
    </slot>
    <div class="calendar" :class="{ 'daily-calendar': isDayMode }">
      <div class="empty-case" />
      <header class="calendar-header">
        <slot name="header">
          <DailyCalendarHeader
            v-if="isDayMode"
            :day="day"
            display-arrows
            @previous="moveToPreviousWeekOrDay"
            @next="moveToNextWeekOrDay"
          />
          <WeeklyCalendarHeader v-else :day="day" />
        </slot>
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
          class="calendar-content-rows__hour-separator"
          :class="getShiftDelimiterClass(hour)"
        />
      </div>

      <div class="calendar-content">
        <slot name="content">
          <DailyCalendarContent
            v-if="isDayMode"
            :events="events"
            :day="day"
            :clickable-events="clickableEvents"
            :availabilities="availabilities"
            @click:event="propagateEventClick"
          />
          <WeeklyCalendarContent
            v-else
            :events="events"
            :day="day"
            :clickable-events="clickableEvents"
            :availabilities="availabilities"
            @click:event="propagateEventClick"
          />
        </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Duration,
  formatDateNumberValue,
  HOURS_IN_DAY,
  OverDate,
  type IProvidePeriod,
} from "@overbookd/time";
import { DAY_MODE, type CalendarMode } from "~/utils/calendar/calendar-mode";
import type { CalendarEvent } from "~/utils/calendar/event";
import { SHIFT_HOURS } from "@overbookd/volunteer-availability";
import { DayPresenter } from "~/utils/calendar/day.presenter";

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
  availabilities: {
    type: Array as PropType<IProvidePeriod[]>,
    default: () => [],
  },
});

const dayModel = defineModel<Date>({
  default: OverDate.now().date,
});
const day = computed<DayPresenter>({
  get: () => new DayPresenter(OverDate.fromLocal(dayModel.value)),
  set: (value) => (dayModel.value = value.date.date),
});
const isDayMode = computed<boolean>(() =>
  props.mode ? props.mode === DAY_MODE : layoutStore.isMobile,
);

const shiftDelimiterMap = new Map<number, string>([
  [SHIFT_HOURS.DAY + 1, "day-start"],
  [SHIFT_HOURS.DAY, "day-end"],
  [SHIFT_HOURS.PARTY + 1, "party-start"],
  [SHIFT_HOURS.PARTY, "party-end"],
  [SHIFT_HOURS.NIGHT + 1, "night-start"],
  [SHIFT_HOURS.NIGHT, "night-end"],
]);
const getShiftDelimiterClass = (hour: number): string => {
  return shiftDelimiterMap.get(hour) || "";
};

const dayGapDuration = isDayMode.value ? Duration.ONE_DAY : Duration.ONE_WEEK;
const moveToPreviousWeekOrDay = () => {
  dayModel.value = day.value.date.minus(dayGapDuration).date;
};
const moveToNextWeekOrDay = () => {
  dayModel.value = day.value.date.plus(dayGapDuration).date;
};

if (publicHolidayStore.all.length === 0) {
  publicHolidayStore.fetchAll();
}

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("click:event", event);
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

  &__hour-separator {
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
  z-index: 10;
}
</style>
