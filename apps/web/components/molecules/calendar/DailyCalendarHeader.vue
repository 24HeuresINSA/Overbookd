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
import { isSameDay } from "@overbookd/time";
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
  const name = props.displayedDay
    .toLocaleDateString("fr-FR", { weekday: "long" })
    .toUpperCase();
  const number = props.displayedDay.getDate();
  return { name, number, date: props.displayedDay };
});

const todayPublicHoliday = computed<DailyEvent | undefined>(() => {
  const events = publicHolidayStore.calendarEvents.filter((event) =>
    isSameDay(event.start, props.displayedDay),
  );
  return events.at(0);
});

const isToday = computed<boolean>(() => {
  const today = new Date();
  return isSameDay(props.displayedDay, today);
});
</script>

<style lang="scss" scoped>
@import "~/assets/calendar.scss";

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
