<template>
  <div class="daily-content">
    <CalendarEvent
      v-for="event in events"
      v-show="isEventInDisplayedDay(event)"
      :key="event.name"
      :event="event"
      :displayed-day="displayedDay"
      :overlapping-events="getOverlappingEvents(event, events)"
    />
  </div>
</template>

<script lang="ts" setup>
import { Period } from "@overbookd/time";
import { getOverlappingEvents } from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  displayedDay: {
    type: Date,
    required: true,
  },
});

const isEventInDisplayedDay = (event: CalendarEvent): boolean => {
  return Period.init(event).isInDay(props.displayedDay);
};
</script>

<style scoped>
.daily-content {
  position: relative;
}
</style>
