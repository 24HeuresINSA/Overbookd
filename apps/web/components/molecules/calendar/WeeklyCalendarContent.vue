<template>
  <div class="weekly-content">
    <div
      v-for="weekDay in day.weekDays"
      :key="weekDay.date.toString()"
      class="weekly-content__day"
    >
      <DailyCalendarContent
        :events="events"
        :day="weekDay"
        :clickable-events="clickableEvents"
        :availabilities="availabilities"
        @click:event="propagateEventClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IProvidePeriod } from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";
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
  clickableEvents: {
    type: Boolean,
    default: false,
  },
  availabilities: {
    type: Array as PropType<IProvidePeriod[]>,
    default: () => [],
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
