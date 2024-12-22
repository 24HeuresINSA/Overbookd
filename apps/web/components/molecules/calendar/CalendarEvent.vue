<template>
  <v-card
    class="calendar-event"
    :class="{ unclickable: !clickable }"
    :color="event.color || 'primary'"
    :style="{
      top: `${eventTopPositionInPixels + 1}px`,
      left: `${eventLeftInPercentage + 1}%`,
      height: `${eventHeightInPixels - 2}px`,
      width: `${eventWidthInPercentage - 2}%`,
    }"
    :href="event.link"
    @click="propagateClick"
  >
    <p class="calendar-event__name">{{ event.name }}</p>
    <p class="calendar-event__hour">{{ eventTimePeriodText }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import {
  formatDateNumberValue,
  MINUTES_IN_DAY,
  ONE_DAY_IN_MS,
  ONE_MINUTE_IN_MS,
  OverDate,
  Period,
} from "@overbookd/time";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  displayedDay: {
    type: Object as PropType<OverDate>,
    required: true,
  },
  overlappingEvents: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
const propagateClick = () => {
  if (props.clickable) emit("click", props.event);
};

const PIXELS_PER_MINUTE = 0.75;

const currentDayStart = computed<Date>(
  () => OverDate.getStartOfDay(props.displayedDay.date).date,
);

const displayedEventPeriod = computed<Period>(() => {
  const currentDayEnd = new Date(
    currentDayStart.value.getTime() + ONE_DAY_IN_MS,
  );

  const validStart =
    props.event.start < currentDayStart.value
      ? currentDayStart.value
      : props.event.start;
  const validEnd =
    props.event.end > currentDayEnd ? currentDayEnd : props.event.end;

  const start = validStart < validEnd ? validStart : validEnd;
  const end = validStart < validEnd ? validEnd : validStart;

  return Period.init({ start, end });
});

const eventStartTotalMinutes = computed<number>(
  () =>
    (displayedEventPeriod.value.start.getTime() -
      currentDayStart.value.getTime()) /
    ONE_MINUTE_IN_MS,
);
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
  const start = OverDate.from(props.event.start);
  const end = OverDate.from(props.event.end);

  const formattedStartMinutes =
    start.minute !== 0 ? formatDateNumberValue(start.minute) : "";
  const formattedEndMinutes =
    end.minute !== 0 ? formatDateNumberValue(end.minute) : "";

  return `${start.hour}h${formattedStartMinutes} - ${end.hour}h${formattedEndMinutes}`;
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
</style>
