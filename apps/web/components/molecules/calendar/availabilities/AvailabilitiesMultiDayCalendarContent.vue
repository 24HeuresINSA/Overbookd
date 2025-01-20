<template>
  <div class="calendar-grid clickable" :style="gridTemplateStyle">
    <div
      v-for="(cell, index) in gridCells"
      :key="index"
      class="calendar-grid__cell"
      :class="[colorClass(cell), cellDurationClass(cell)]"
      :style="cellGridStyle(cell)"
      @click="propagateCellClick(cell)"
    >
      <span>{{ cell.charisma }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HOURS_IN_DAY, OverDate, Period, type Hour } from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import {
  findCharismaPerHour,
  type AvailabilityEvent,
} from "~/utils/availabilities/availabilities";
import { SHIFT_HOURS } from "@overbookd/volunteer-availability";

type AvailabilityCell = AvailabilityEvent & {
  duration: number;
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
};

const charismaPeriodStore = useCharismaPeriodStore();
const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  days: {
    type: Array as PropType<DayPresenter[]>,
    required: true,
  },
});

const TWO_HOURS_CELL_COUNT = (SHIFT_HOURS.PARTY - SHIFT_HOURS.NIGHT) / 2;
const ONE_HOUR_CELL_COUNT = HOURS_IN_DAY - TWO_HOURS_CELL_COUNT * 2;
const CELLS_IN_DAY = TWO_HOURS_CELL_COUNT + ONE_HOUR_CELL_COUNT;

const gridCells = computed<AvailabilityCell[]>(() => {
  const daysArray = Array.from({ length: props.days.length }, (_, i) => i);
  return daysArray.flatMap((dayIndex) => {
    const day = props.days.at(dayIndex);
    if (!day) return [];
    const dayStart = day.startsAt;
    return generateAvailabilityCells(dayStart, dayIndex);
  });
});
const generateAvailabilityCells = (
  dayStart: OverDate,
  dayIndex: number,
): AvailabilityCell[] => {
  let hour: Hour = 0;
  return Array.from({ length: CELLS_IN_DAY }, (_, cellIndex) => {
    const start = OverDate.init({
      date: dayStart.dateString,
      hour: hour,
    });

    const duration = isPartyShift(hour) ? 1 : 2;
    const end = OverDate.init({
      date: dayStart.dateString,
      hour: Math.min(hour + duration, HOURS_IN_DAY) as Hour,
    });

    const rowStart = cellIndex + 1;
    const rowEnd = rowStart + duration - 1;

    hour += duration;

    return {
      start: start.date,
      end: end.date,
      charisma: findCharismaPerHour(charismaPeriodStore.all, start.date),
      duration: duration,
      rowStart,
      rowEnd,
      columnStart: dayIndex + 1,
      columnEnd: dayIndex + 2,
    };
  });
};

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

const colorClass = ({ start, end }: AvailabilityEvent) => {
  const period = Period.init({ start, end });
  const isSaved = savedAvailabilities.value.some((saved) =>
    saved.includes(period),
  );
  const isSelected = selectedAvailabilities.value.some((selected) =>
    selected.includes(period),
  );
  const hasError = errors.value.some((error) => error.period.includes(period));

  if (hasError) return "error";
  if (isSaved) return "validated";
  if (isSelected) return "selected";
  return "unselected";
};
const cellDurationClass = (cell: AvailabilityCell) => {
  return cell.duration === 1 ? "cell-1h" : "cell-2h";
};
const cellGridStyle = (cell: AvailabilityCell) => {
  return {
    gridRowStart: cell.rowStart,
    gridRowEnd: cell.rowEnd,
    gridColumnStart: cell.columnStart,
    gridColumnEnd: cell.columnEnd,
  };
};

const emit = defineEmits(["click:event"]);
const propagateCellClick = (cell: AvailabilityEvent) => {
  emit("click:event", cell);
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.calendar-grid {
  display: grid;
  grid-auto-flow: column;
  width: 100%;
  height: 100%;

  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
    &:last-child {
      border-bottom-right-radius: $calendar-radius;
    }
  }

  .cell-1h {
    height: $hour-height;
  }
  .cell-2h {
    height: $hour-height * 2;
  }
}

.unselected {
  background-color: rgba($blue-24h, 0.3);
  color: rgb(var(--v-theme-on-surface));
  &:hover {
    background-color: rgba($blue-24h, 0.9);
  }
}
.selected {
  background-color: rgba($blue-24h, 1);
  color: white;
}
.validated {
  background-color: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-on-success));
}
.error {
  background-color: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
}
</style>
