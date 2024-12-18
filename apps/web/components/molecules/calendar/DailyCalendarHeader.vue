<template>
  <header
    class="header-day"
    :class="{ today: isToday, 'with-daily-event': todayPublicHoliday }"
  >
    <p class="header-day__name">{{ displayableDay.name }}</p>
    <p class="header-day__number">{{ displayableDay.number }}</p>
    <v-card
      v-if="todayPublicHoliday"
      :color="todayPublicHoliday.color"
      class="header-day__daily-event"
    >
      <span>{{ todayPublicHoliday.name }}</span>
    </v-card>
  </header>
</template>

<script lang="ts" setup>
import {
  formatDateDayFullName,
  formatDateDayNumber,
  OverDate,
} from "@overbookd/time";
import type { CalendarDay } from "~/utils/calendar/calendar.utils";
import type { DailyEvent } from "~/utils/calendar/event";

const publicHolidayStore = usePublicHolidayStore();

const props = defineProps({
  displayedDay: {
    type: Date,
    required: true,
  },
});

const displayableDay = computed<CalendarDay>(() => {
  const name = formatDateDayFullName(props.displayedDay).toUpperCase();
  const number = +formatDateDayNumber(props.displayedDay);
  return { name, number, date: props.displayedDay };
});

const calendarEvents = ref<DailyEvent[]>([]);
const calendarEventsCurrentYear = ref<number>(props.displayedDay.getFullYear());
calendarEvents.value = publicHolidayStore.calendarEventsForYear(
  calendarEventsCurrentYear.value,
);
const updateCalendarEvents = () => {
  const year = props.displayedDay.getFullYear();
  if (calendarEventsCurrentYear.value === year) return;
  calendarEventsCurrentYear.value = year;
  calendarEvents.value = publicHolidayStore.calendarEventsForYear(year);
};
watch(() => props.displayedDay, updateCalendarEvents, { immediate: true });

const publicHolidaysByDate = computed(() => {
  return calendarEvents.value.reduce(
    (acc, event) => {
      const dateKey = OverDate.from(event.start).dateString;
      // eslint-disable-next-line security/detect-object-injection
      acc[dateKey] = event;
      return acc;
    },
    {} as Record<string, DailyEvent>,
  );
});

const todayPublicHoliday = computed<DailyEvent | undefined>(() => {
  const dateKey = OverDate.from(props.displayedDay).dateString;
  // eslint-disable-next-line security/detect-object-injection
  return publicHolidaysByDate.value[dateKey];
});

const isToday = computed<boolean>(() => {
  const today = OverDate.today();
  const displayedDay = OverDate.from(props.displayedDay);
  return OverDate.isSameDay(displayedDay, today);
});
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.header-day {
  width: 100%;
  min-width: $calendar-day-min-width;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px;
  &__name {
    font-size: 1.2rem;
  }
  &__number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
  }
  &__daily-event {
    width: 100%;
    height: 20px;
    padding: 0 !important;
    margin: 0 !important;
    background-color: rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-on-error));
    span {
      font-size: 0.75rem;
      font-weight: 500;
      padding-left: 10px;
    }
  }
}

.with-daily-event {
  padding-bottom: 5px;
}

.today {
  color: rgb(var(--v-theme-primary));
}
</style>
