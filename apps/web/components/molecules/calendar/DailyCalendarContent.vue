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
  </div>
</template>

<script lang="ts" setup>
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

const eventsToDisplay = computed<CalendarEvent[]>(() =>
  props.day.eventsOccuringThatDayAmong(props.events),
);

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) =>
  emit("click:event", event);
</script>

<style scoped>
.daily-content {
  position: relative;
}
</style>
