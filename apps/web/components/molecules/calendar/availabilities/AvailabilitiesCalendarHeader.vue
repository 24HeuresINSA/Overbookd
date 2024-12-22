<template>
  <header class="header-days" :style="gridTemplateStyle">
    <DailyCalendarHeader
      v-for="day in displayedDays"
      :key="day.date.toISOString()"
      :displayed-day="day"
    />
  </header>
</template>

<script lang="ts" setup>
import type { OverDate } from "@overbookd/time";

const props = defineProps({
  displayedDays: {
    type: Array as PropType<OverDate[]>,
    required: true,
  },
});

const gridTemplateStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.displayedDays.length}, 1fr)`,
}));
</script>

<style scoped>
.header-days {
  display: grid;
}
</style>
