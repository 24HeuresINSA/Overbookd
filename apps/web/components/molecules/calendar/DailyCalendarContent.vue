<template>
  <div class="daily-content">
    <CalendarEvent
      v-for="event in eventsToDisplay"
      :key="event.id"
      :event="event"
      :day="day"
      :among="eventsToDisplayWithout(event)"
      :clickable="clickableEvents"
      @click="propagateEventClick"
      @click-right="propagateEventRightClick"
    />
    <div v-if="availabilities.length > 0" class="availabilities">
      <div
        v-for="hour in HOURS_IN_DAY"
        :key="hour"
        class="availability"
        :class="{ available: isAvailable(hour - 1) }"
        @click="propagatePeriodClick(hour - 1)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Duration,
  HOURS_IN_DAY,
  isHour,
  OverDate,
  Period,
  type Hour,
  type IProvidePeriod,
} from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
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

const eventsToDisplay = computed<CalendarEvent[]>(() =>
  props.day.eventsOccuringThatDayAmong(props.events),
);

const emit = defineEmits(["click:event", "click-right:event", "click:period"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("click:event", event);
};
const propagateEventRightClick = (event: CalendarEvent) => {
  emit("click-right:event", event);
};
const propagatePeriodClick = (hour: number) => {
  if (!isHour(hour)) return;
  const start = OverDate.init({ date: props.day.date.dateString, hour });
  const end = start.plus(Duration.ONE_HOUR);
  const period = Period.init({ start: start.date, end: end.date });
  emit("click:period", period);
};

const isAvailable = (hour: number): boolean => {
  const date = OverDate.init({
    date: props.day.date.dateString,
    hour: hour as Hour,
  });
  return date.isIncludedBy(props.availabilities);
};

const eventsToDisplayWithout = (event: CalendarEvent): CalendarEvent[] => {
  return eventsToDisplay.value.filter((e) => e.id !== event.id);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.daily-content {
  position: relative;
  height: 100%;
}

.availability {
  height: $hour-height;
}
.available {
  background-color: rgba(var(--v-theme-success), 0.2);
}
</style>
