<template>
  <div class="calendar-grid clickable" :style="gridTemplateStyle">
    <div
      v-for="(cell, index) in gridCells"
      :key="index"
      class="calendar-grid__cell"
      :class="[colorClass(cell), cellDurationClass(cell)]"
      :style="cellGridStyle(cell)"
      @click="propagateAvailabilityClick(cell)"
    >
      <span>{{ cell.charisma }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import {
  type AvailabilityCellWithCharisma,
  cellDurationClass,
  cellGridStyle,
  CELLS_IN_DAY,
  generateAvailabilityCellsWithCharisma,
} from "~/utils/availabilities/availability-grid.utils";

const charismaPeriodStore = useCharismaPeriodStore();
const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  days: {
    type: Array as PropType<DayPresenter[]>,
    required: true,
  },
});

const gridCells = computed<AvailabilityCellWithCharisma[]>(() =>
  props.days.flatMap((day, dayIndex) =>
    generateAvailabilityCellsWithCharisma(
      day.startsAt,
      dayIndex,
      charismaPeriodStore.all,
    ),
  ),
);

const gridTemplateStyle = computed(() => ({
  gridTemplateColumns: `repeat(${props.days.length}, 1fr)`,
  gridTemplateRows: `repeat(${CELLS_IN_DAY}, auto)`,
}));

const selectedAvailabilities = computed(
  () => availabilityStore.availabilities.selected,
);
const savedAvailabilities = computed(
  () => availabilityStore.availabilities.recorded,
);
const errors = computed(() => availabilityStore.availabilities.errors);

const colorClass = ({ start }: AvailabilityCellWithCharisma) => {
  const isSaved = savedAvailabilities.value.some((saved) =>
    saved.isIncluding(start),
  );
  const isSelected = selectedAvailabilities.value.some((selected) =>
    selected.isIncluding(start),
  );
  const hasError = errors.value.some((error) =>
    error.period.isIncluding(start),
  );

  if (hasError) return "error";
  if (isSaved) return "validated";
  if (isSelected) return "selected";
  return "unselected";
};

const emit = defineEmits(["click:availability"]);
const propagateAvailabilityClick = (
  availability: AvailabilityCellWithCharisma,
) => {
  emit("click:availability", availability);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;
</style>
