<template>
  <div class="weekly-content">
    <div
      v-for="day in getWeekDays(displayedDay)"
      :key="day.date.time"
      class="weekly-content__day"
    >
      <DailyCalendarContent
        :events="events"
        :displayed-day="day.date"
        :clickable-events="clickableEvents"
        @click:event="propagateEventClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { OverDate } from "@overbookd/time";
import { getWeekDays } from "~/utils/calendar/calendar.utils";
import type { CalendarEvent } from "~/utils/calendar/event";

defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  displayedDay: {
    type: Object as PropType<OverDate>,
    required: true,
  },
  clickableEvents: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("click:event", event);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.weekly-content {
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
