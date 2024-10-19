<template>
  <header class="header-day" :class="{ today: isToday }">
    <p class="header-day__name">{{ displayableDay.name }}</p>
    <p class="header-day__number">{{ displayableDay.number }}</p>
  </header>
</template>

<script lang="ts" setup>
import { isSameDay } from "@overbookd/time";
import type { CalendarDay } from "~/utils/calendar/calendar.utils";

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
  return { name, number };
});

const isToday = computed<boolean>(() => {
  const today = new Date();
  return isSameDay(props.displayedDay, today);
});
</script>

<style lang="scss" scoped>
@import "./calendar.scss";

.header-day {
  width: 100%;
  grid-row: 1;
  grid-column: 2;
  border-top-right-radius: $calendar-radius;
  border-left: 1px solid rgb(var(--v-theme-on-surface));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
}

.today {
  color: rgb(var(--v-theme-primary));
}
</style>
