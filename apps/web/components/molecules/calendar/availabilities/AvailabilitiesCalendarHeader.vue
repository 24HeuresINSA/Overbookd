<template>
  <header class="header-days" :style="gridTemplateStyle">
    <DailyCalendarHeader
      v-for="day in displayedDays"
      :key="day.toISOString()"
      :displayed-day="day"
    />
  </header>
</template>

<script lang="ts" setup>
const props = defineProps({
  displayedDays: {
    type: Array as PropType<Date[]>,
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
