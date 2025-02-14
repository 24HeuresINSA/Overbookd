<template>
  <div class="multi-calendar" :style="gridStyle">
    <OverCalendar :mode="DAY_MODE">
      <template #header>
        <DailyCalendarHeader :day="day" />
      </template>
      <template #content>
        <div
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          class="multi-calendar__volunteer"
        >
          <DailyCalendarContent
            :day="day"
            :events="volunteer.assignments"
            :availabilities="volunteer.availabilities"
          />
        </div>
      </template>
    </OverCalendar>
  </div>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import type { CalendarEvent } from "~/utils/calendar/event";
import { DAY_MODE } from "~/utils/calendar/calendar-mode";

const day = defineModel<DayPresenter>({
  default: new DayPresenter(OverDate.now()),
});

const props = defineProps({
  volunteers: {
    type: Array as PropType<VolunteerForCalendar[]>,
    default: () => [],
  },
  eventToAdd: {
    type: Object as PropType<CalendarEvent | undefined>,
    default: () => undefined,
  },
});

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.volunteers.length}, 1fr)`,
}));
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multi-calendar {
  width: 100%;
  height: 100%;
  display: grid;
  &__volunteer {
    min-width: $calendar-day-min-width;
    border-left: 1px solid rgba(var(--v-theme-on-surface), 0.2);
    &:first-child {
      border-left: none;
    }
  }
}
</style>
