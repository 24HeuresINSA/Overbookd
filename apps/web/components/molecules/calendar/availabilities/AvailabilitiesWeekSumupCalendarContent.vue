<template>
  <div class="calendar-grid clickable">
    <div
      v-for="cell in gridCells"
      :key="cell.toString()"
      class="calendar-grid__cell"
      :class="[colorClass(cell), cellDurationClass(cell)]"
      :style="cellGridStyle(cell)"
      @click="propagateAvailabilityClick(cell)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import {
  generateAvailabilityCells,
  cellGridStyle,
  cellDurationClass,
  type AvailabilityCell,
} from "~/utils/availabilities/availability-grid.utils";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { Availabilities } from "@overbookd/volunteer-availability";

const props = defineProps({
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
  manager: {
    type: Object as PropType<Availabilities>,
    required: true,
  },
});

const gridCells = computed<AvailabilityCell[]>(() => {
  return props.day.weekDays.flatMap((day, dayIndex) =>
    generateAvailabilityCells(day.startsAt, dayIndex),
  );
});

const colorClass = ({ start }: AvailabilityCell) => {
  const isSelected = props.manager.selected.some((availability) =>
    availability.isIncluding(start),
  );
  const hasError = props.manager.errors.some((error) =>
    error.period.isIncluding(start),
  );

  if (hasError) return "error";
  if (isSelected) return "selected";
  return "unselected";
};

const emit = defineEmits(["click:availability"]);
const propagateAvailabilityClick = (availability: AvailabilityCell) => {
  emit("click:availability", availability);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.calendar-grid {
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(24, auto);
}
</style>
