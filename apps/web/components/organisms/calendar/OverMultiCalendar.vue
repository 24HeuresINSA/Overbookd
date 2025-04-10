<template>
  <OverCalendar v-model="dayModel" :mode="DAY_MODE" class="multi-calendar">
    <template #header>
      <DailyCalendarHeader :day="day" class="multi-calendar__day" />
      <div class="multi-calendar__volunteers">
        <NeedHelpVolunteerResumeCalendarHeader
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          :volunteer="volunteer"
          class="multi-calendar__volunteer"
        />
      </div>
    </template>
    <template #content>
      <div class="multi-calendar__volunteers">
        <DailyCalendarContent
          v-for="volunteer in volunteers"
          :key="volunteer.id"
          :day="day"
          :events="withEventToAdd(volunteer.assignments)"
          :availabilities="volunteer.availabilities"
          class="multi-calendar__volunteer"
        />
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import type { CalendarEvent } from "~/utils/calendar/event";
import { DAY_MODE } from "~/utils/calendar/calendar-mode";

const dayModel = defineModel<Date>({
  default: OverDate.now().date,
});
const day = computed<DayPresenter>({
  get: () => new DayPresenter(OverDate.fromLocal(dayModel.value)),
  set: (value) => (dayModel.value = value.date.date),
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

const withEventToAdd = (assignments: CalendarEvent[]): CalendarEvent[] => {
  return props.eventToAdd ? [...assignments, props.eventToAdd] : assignments;
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multi-calendar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.multi-calendar__volunteers {
  display: flex;
  overflow-x: auto;
  width: 100%;
  min-width: 0;
  flex-grow: 1;
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.2);
}

.multi-calendar__volunteer {
  flex: 0 0 150px;
  width: 150px;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.2);

  &:first-child {
    border-left: none;
  }
}
</style>
