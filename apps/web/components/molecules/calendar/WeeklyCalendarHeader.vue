<template>
  <header class="header-days">
    <DailyCalendarHeader
      v-for="day in getWeekDays(props.displayedDay)"
      :key="day.date.time"
      :displayed-day="day.date"
    />
  </header>
</template>

<script lang="ts" setup>
import type { OverDate } from "@overbookd/time";
import { getWeekDays } from "~/utils/calendar/calendar.utils";

const props = defineProps({
  displayedDay: {
    type: Object as PropType<OverDate>,
    required: true,
  },
});
</script>

<style scoped>
.header-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
</style>
