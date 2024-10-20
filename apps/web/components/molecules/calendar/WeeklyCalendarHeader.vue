<template>
  <header class="header-days">
    <DailyCalendarHeader
      v-for="day in getWeekDays(displayedDay)"
      :key="day.date.toISOString()"
      :displayed-day="day.date"
    />
  </header>
</template>

<script lang="ts" setup>
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
</style>
