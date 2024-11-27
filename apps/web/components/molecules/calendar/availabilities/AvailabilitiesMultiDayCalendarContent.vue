<template>
  <div class="multiday-content">
    <div
      v-for="day in displayedDays"
      :key="day.toISOString()"
      class="multiday-content__day"
    >
      <AvailabilitiesDailyCalendarContent
        :events="events"
        :displayed-day="day"
        @event-click="propagateEventClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";

defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  displayedDays: {
    type: Array as PropType<Date[]>,
    required: true,
  },
});

const emit = defineEmits(["event-click"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("event-click", event);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multiday-content {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  &__day {
    min-width: $calendar-day-min-width;
    border-left: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    &:first-child {
      border-left: none;
    }
  }
}
</style>
