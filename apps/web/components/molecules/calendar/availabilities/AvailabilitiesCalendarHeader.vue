<template>
  <header class="header-days" :style="gridTemplateStyle">
    <DailyCalendarHeader
      v-for="day in days"
      :key="day.date.toString()"
      :day="day"
    />
  </header>
</template>

<script lang="ts" setup>
import type { DayPresenter } from "~/utils/calendar/day.presenter";

const props = defineProps({
  days: {
    type: Array as PropType<DayPresenter[]>,
    required: true,
  },
});

const gridTemplateStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.days.length}, 1fr)`,
}));
</script>

<style scoped>
.header-days {
  display: grid;
}
</style>
