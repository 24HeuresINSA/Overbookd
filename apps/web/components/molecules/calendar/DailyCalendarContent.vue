<template>
  <div class="daily-content">
    <CalendarEvent
      v-for="event in eventsInDisplayedDay"
      :key="event.id"
      :event="event"
      :day="day"
      :overlapping-events="getOverlappingEvents(event, events)"
      :clickable="clickableEvents"
      @click="propagateEventClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { Period } from "@overbookd/time";
import { getOverlappingEvents } from "~/utils/calendar/calendar.utils";
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

const eventsInDisplayedDay = computed<CalendarEvent[]>(() => {
  return props.events.filter((event) =>
    Period.init(event).isInDay(props.day.date.date),
  );
});

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) =>
  emit("click:event", event);
</script>

<style scoped>
.daily-content {
  position: relative;
}
</style>
