<template>
  <header class="header-days">
    <DailyCalendarHeader
      v-for="weekDay in day.weekDays"
      :key="weekDay.date.toString()"
      :day="weekDay"
    />
  </header>
</template>

<script lang="ts" setup>
import { DayPresenter } from "~/utils/calendar/day.presenter";

defineProps({
  day: {
    type: Object as PropType<DayPresenter>,
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
