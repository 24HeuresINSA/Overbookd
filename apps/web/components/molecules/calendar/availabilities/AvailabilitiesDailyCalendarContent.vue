<template>
  <div class="daily-content">
    <AvailabilitiesCalendarEvent
      v-for="event in eventsInDisplayedDay"
      :key="event.id"
      :event="event"
      :displayed-day="displayedDay"
      @click="propagateEventClick"
    />
  </div>
</template>

<script lang="ts" setup>
import { OverDate, Period } from "@overbookd/time";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  displayedDay: {
    type: Object as PropType<OverDate>,
    required: true,
  },
});

const eventsInDisplayedDay = computed<CalendarEvent[]>(() => {
  return props.events.filter((event) =>
    Period.init(event).isInDay(props.displayedDay.date),
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
