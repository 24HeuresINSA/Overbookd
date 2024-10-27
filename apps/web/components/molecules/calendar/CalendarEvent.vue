<template>
  <v-card
    class="calendar-event"
    :class="{
      unclickable: !event.link,
      'not-hovered': !isHovered && hoveredEventId,
    }"
    :color="event.color || 'primary'"
    :style="{
      top: `${eventTopPositionInPixels + 1}px`,
      left: `${eventLeftInPercentage + 1}%`,
      height: `${eventHeightInPixels - 2}px`,
      width: `${eventWidthInPercentage - 2}%`,
    }"
    :href="event.link"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <p class="calendar-event__name">{{ event.name }}</p>
    <p class="calendar-event__hour">{{ eventTimePeriodText }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import {
  MINUTES_IN_DAY,
  MINUTES_IN_HOUR,
  ONE_MINUTE_IN_MS,
  Period,
} from "@overbookd/time";
import { formatDateNumberValue } from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  displayedDay: {
    type: Date,
    required: true,
  },
  overlappingEvents: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
});

const hoveredEventId = defineModel<string | undefined>("hoveredEventId");
const isHovered = computed<boolean>(
  () => hoveredEventId.value === props.event.id,
);
const handleMouseEnter = () => (hoveredEventId.value = props.event.id);
const handleMouseLeave = () => {
  if (isHovered.value) {
    hoveredEventId.value = undefined;
  }
};

const PIXELS_PER_MINUTE = 0.75;

const displayedEventPeriod = computed<Period>(() => {
  const currentDayStart = new Date(props.displayedDay);
  currentDayStart.setHours(0, 0, 0, 0);
  const currentDayEnd = new Date(props.displayedDay);
  currentDayEnd.setHours(23, 59, 59, 999);

  const validStart =
    props.event.start < currentDayStart ? currentDayStart : props.event.start;
  const validEnd =
    props.event.end > currentDayEnd ? currentDayEnd : props.event.end;

  const start = validStart < validEnd ? validStart : validEnd;
  const end = validStart < validEnd ? validEnd : validStart;

  return Period.init({ start, end });
});

const eventStartTotalMinutes = computed<number>(() => {
  return (
    displayedEventPeriod.value.start.getHours() * MINUTES_IN_HOUR +
    displayedEventPeriod.value.start.getMinutes()
  );
});
const eventTopPositionInPixels = computed<number>(() => {
  return eventStartTotalMinutes.value * PIXELS_PER_MINUTE;
});

const eventHeightInPixels = computed<number>(() => {
  const eventDurationInMs = displayedEventPeriod.value.duration.inMilliseconds;
  const eventDurationInMinutes = eventDurationInMs / ONE_MINUTE_IN_MS;
  const remainingEventMinutesInDay =
    MINUTES_IN_DAY - eventStartTotalMinutes.value;
  return (
    Math.min(eventDurationInMinutes, remainingEventMinutesInDay) *
    PIXELS_PER_MINUTE
  );
});

const overlappingEventsOnSameDay = computed<CalendarEvent[]>(() => {
  return props.overlappingEvents.filter((e) => {
    return Period.init(e).isOverlapping(displayedEventPeriod.value);
  });
});
const eventWidthInPercentage = computed<number>(() => {
  return 100 / overlappingEventsOnSameDay.value.length;
});
const eventLeftInPercentage = computed<number>(() => {
  const index = overlappingEventsOnSameDay.value.indexOf(props.event);
  return index * eventWidthInPercentage.value;
});

const eventTimePeriodText = computed<string>(() => {
  const start = props.event.start;
  const end = props.event.end;

  const formattedStartMinutes = start.getMinutes()
    ? formatDateNumberValue(start.getMinutes())
    : "";
  const formattedEndMinutes = end.getMinutes()
    ? formatDateNumberValue(end.getMinutes())
    : "";
  return `${start.getHours()}h${formattedStartMinutes} - ${end.getHours()}h${formattedEndMinutes}`;
});
</script>

<style lang="scss" scoped>
.calendar-event {
  position: absolute;
  margin: 0 !important;
  border-radius: 6px !important;
  padding: 8px 3px 8px 10px !important;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__name {
    font-size: 0.85rem;
    font-weight: bold;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__hour {
    font-size: 0.75rem;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.not-hovered {
  opacity: 0.8;
}
</style>
