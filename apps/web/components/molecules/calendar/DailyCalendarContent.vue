<template>
  <div class="daily-content">
    <CalendarEvent
      v-for="event in eventsInDisplayedDay"
      :key="event.id"
      :event="event"
      :displayed-day="displayedDay"
      :overlapping-events="getOverlappingEvents(event, events)"
      :clickable="clickableEvents"
      @click="propagateEventClick"
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
  clickableEvents: {
    type: Boolean,
    default: false,
  },
});

const eventsInDisplayedDay = computed<CalendarEvent[]>(() => {
  return props.events.filter((event) =>
    Period.init(event).isInDay(props.displayedDay),
  );
});

const emit = defineEmits(["event-click"]);
const propagateEventClick = (event: CalendarEvent) =>
  emit("event-click", event);
</script>

<style scoped>
.daily-content {
  position: relative;
}
</style>
