<template>
  <div class="multiday-content" :style="gridTemplateStyle">
    <div
      v-for="day in days"
      :key="day.toString()"
      class="multiday-content__day"
    >
      <AvailabilitiesDailyCalendarContent
        :events="events"
        :day="day"
        @click:event="propagateEventClick"
      />
    </div>
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
  days: {
    type: Array as PropType<DayPresenter[]>,
    required: true,
  },
});

const gridTemplateStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.days.length}, 1fr)`,
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
