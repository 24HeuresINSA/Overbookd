<template>
  <div class="daily-content">
    <CalendarEvent
      v-for="(event, index) in eventsToDisplay"
      :key="event.id"
      :event="event"
      :day="day"
      :among="{ count: eventsToDisplay.length, index }"
      :clickable="clickableEvents"
      @click="propagateEventClick"
    />
    <div v-if="availabilities.length > 0" class="availabilities">
      <div
        v-for="hour in HOURS_IN_DAY"
        :key="hour"
        class="availability"
        :class="{ available: isAvailable(hour - 1) }"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  HOURS_IN_DAY,
  OverDate,
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

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("click:event", event);
};

const isAvailable = (hour: number): boolean => {
  const date = OverDate.init({
    date: props.day.date.dateString,
    hour: hour as Hour,
  });
  return date.isIncludedBy(props.availabilities);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.daily-content {
  position: relative;
  height: 100%;
}

.availabilities {
  position: relative;
  height: $calendar-content-height;
  .availability {
    height: $hour-height;
  }
  .available {
    background-color: rgba(var(--v-theme-success), 0.2);
  }
}
</style>
