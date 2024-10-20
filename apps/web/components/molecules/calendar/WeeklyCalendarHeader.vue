<template>
  <header class="header-days">
    <div
      v-for="day in getWeekDays(displayedDay)"
      :key="day.date.toISOString()"
      class="header-day"
      :class="{ today: isSameDay(displayedDay, day.date) }"
    >
      <p class="header-day__name">{{ day.name }}</p>
      <p class="header-day__number">{{ day.number }}</p>
    </div>
  </header>
</template>

<script lang="ts" setup>
import { isSameDay } from "@overbookd/time";
import { getWeekDays } from "~/utils/calendar/calendar.utils";

defineProps({
  displayedDay: {
    type: Date,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
@import "~/assets/calendar.scss";

.header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.header-day {
  display: flex;
  min-width: $calendar-day-min-width;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.2);
  &:last-child {
    border-right: none;
  }
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
