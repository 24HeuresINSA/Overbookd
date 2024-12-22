<template>
  <div class="multiday-content" :style="gridTemplateStyle">
    <div
      v-for="day in displayedDays"
      :key="day.time"
      class="multiday-content__day"
    >
      <AvailabilitiesDailyCalendarContent
        :events="events"
        :displayed-day="day"
        @click:event="propagateEventClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { OverDate } from "@overbookd/time";
import type { CalendarEvent } from "~/utils/calendar/event";

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  displayedDays: {
    type: Array as PropType<OverDate[]>,
    required: true,
  },
});

const gridTemplateStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.displayedDays.length}, 1fr)`,
}));

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("click:event", event);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multiday-content {
  width: 100%;
  height: 100%;
  display: grid;
  &__day {
    min-width: $calendar-day-min-width;
    border-left: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    &:first-child {
      border-left: none;
    }
  }
}
</style>
