<template>
  <div class="daily-content">
    <CalendarEvent
      v-for="event in day.filterEventsToDisplay(events)"
      :key="event.id"
      :event="event"
      :day="day"
      :among="amongEvent(event)"
      :clickable="clickableEvents"
      @click="propagateEventClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { Period } from "@overbookd/time";
import type { AmongCalendarEvent } from "~/utils/calendar/calendar.presenter";
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
});

const amongEvent = (event: CalendarEvent): AmongCalendarEvent => {
  const eventPeriod = Period.init(event);
  const overlappingEvents = props.events.filter((e) =>
    Period.init(e).isOverlapping(eventPeriod),
  );
  return {
    count: overlappingEvents.length,
    index: overlappingEvents.indexOf(event),
  };
};

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) =>
  emit("click:event", event);
</script>

<style scoped>
.daily-content {
  position: relative;
}
</style>
