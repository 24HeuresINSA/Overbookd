<template>
  <header class="header-days clickable" :style="gridTemplateStyle">
    <DailyCalendarHeader
      v-for="day in days"
      :key="day.date.toString()"
      :day="day"
      clickable
      @click="propagateDayClick"
    />
    <v-tooltip activator="parent" location="top">
      <v-icon icon="mdi-lightbulb-alert-outline" /> Astuce : Tu peux
      sélectionner tous les créneaux d'une journée en cliquant sur le chiffre de
      la date.
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

const emit = defineEmits(["click"]);
const propagateDayClick = (day: DayPresenter) => emit("click", day);
</script>

<style scoped>
.header-days {
  display: grid;
}
</style>
