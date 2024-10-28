<template>
  <div class="daily-content">
    <div v-for="event in events" :key="event.id">
      <CalendarEvent
        v-if="isEventInDisplayedDay(event)"
        :key="event.id"
        v-model:hovered-event-id="hoveredEventId"
        :event="event"
        :displayed-day="displayedDay"
        :overlapping-events="getOverlappingEvents(event, events)"
        :clickable="clickableEvents"
        @click="propagateEventClick"
      />
    </div>
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

const isEventInDisplayedDay = (event: CalendarEvent): boolean => {
  return Period.init(event).isInDay(props.displayedDay);
};

const hoveredEventId = defineModel<string | undefined>("hoveredEventId");

const emit = defineEmits(["event-click"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("event-click", event);
};
</script>

<style scoped>
.daily-content {
  position: relative;
}
</style>
