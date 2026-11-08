<template>
  <header class="header-days clickable" :style="gridTemplateStyle">
    <DailyCalendarHeader
      v-for="day in days"
      :key="day.date.toString()"
      :day="day"
      :display-arrows="days.length === 1"
      clickable
      @click="propagateDayClick"
      @previous="propagatePrevious"
      @next="propagateNext"
    />
    <v-tooltip activator="parent" location="top">
      <v-icon icon="mdi-lightbulb-alert-outline" /> Astuce : Tu peux
      sélectionner tous les créneaux d'une journée en cliquant sur la date.
    </v-tooltip>
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

const emit = defineEmits(["click", "previous", "next"]);
const propagateDayClick = (day: DayPresenter) => emit("click", day);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
</script>

<style scoped>
.header-days {
  display: grid;
}
</style>
