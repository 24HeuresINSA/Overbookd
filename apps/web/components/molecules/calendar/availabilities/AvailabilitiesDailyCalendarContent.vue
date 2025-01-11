<template>
  <div class="daily-content">
    <AvailabilitiesCalendarEvent
      v-for="event in day.eventsOccuringThatDayAmong(events)"
      :key="event.id"
      :event="event"
      :day="day"
      @click="propagateEventClick"
    />
  </div>
</template>

<script lang="ts" setup>
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { CalendarEvent } from "~/utils/calendar/event";

defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
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
