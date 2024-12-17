<template>
  <header class="header-days">
    <DailyCalendarHeader
      v-for="day in weekDays"
      :key="day.date.toISOString()"
      :displayed-day="day.date"
    />
  </header>
</template>

<script lang="ts" setup>
import { getWeekDays, type CalendarDay } from "~/utils/calendar/calendar.utils";

const props = defineProps({
  displayedDay: {
    type: Date,
    required: true,
  },
});

const weekDays = computed<CalendarDay[]>(() => getWeekDays(props.displayedDay));
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
</style>
