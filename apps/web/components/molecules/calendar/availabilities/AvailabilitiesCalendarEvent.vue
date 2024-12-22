<template>
  <v-card
    class="calendar-event"
    :class="colorClass"
    :style="{
      top: `${eventTopPositionInPixels + 1}px`,
      height: `${eventHeightInPixels - 2}px`,
    }"
    hover
    @click="propagateClick"
  >
    <p class="calendar-event__name">{{ event.name }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import {
  MINUTES_IN_DAY,
  MINUTES_IN_HOUR,
  ONE_MINUTE_IN_MS,
  Period,
} from "@overbookd/time";
import type { AvailabilityErrorMessage } from "@overbookd/volunteer-availability";
import type { CalendarEvent } from "~/utils/calendar/event";

const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  displayedDay: {
    type: Date,
    required: true,
  },
});

const emit = defineEmits(["click"]);
const propagateClick = () => emit("click", props.event);

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

const selectedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.selected as Period[],
);
const savedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.recorded as Period[],
);
const errors = computed<AvailabilityErrorMessage[]>(
  () => availabilityStore.availabilities.errors as AvailabilityErrorMessage[],
);

const isSaved = (period: Period): boolean => {
  return savedAvailabilities.value.some((availability) =>
    availability.includes(period),
  );
};
const isSelected = (period: Period): boolean => {
  return selectedAvailabilities.value.some((availability) =>
    availability.includes(period),
  );
};
const hasError = (period: Period): boolean => {
  return errors.value.some((error) => error.period.includes(period));
};

const colorClass = computed<string>(() => {
  const period = displayedEventPeriod.value;
  if (hasError(period)) return "error";
  if (isSaved(period)) return "validated";
  if (isSelected(period)) return "selected";
  return "unselected";
});
</script>

<style lang="scss" scoped>
.calendar-event {
  position: absolute;
  width: 100%;
  margin: 0 !important;
  border-radius: 6px !important;
  padding: 8px 3px 8px 10px !important;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;

  &__name {
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.validated {
  background-color: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-on-success));
}
.selected {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
.unselected {
  background-color: rgba(var(--v-theme-primary), 0.3);
  color: rgb(var(--v-theme-on-surface));
}
.error {
  background-color: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
}
</style>
