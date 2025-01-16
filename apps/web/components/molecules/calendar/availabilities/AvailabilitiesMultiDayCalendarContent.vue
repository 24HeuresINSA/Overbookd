<template>
  <div class="calendar-grid" :style="gridTemplateStyle">
    <div
      v-for="(cell, index) in gridCells"
      :key="index"
      class="calendar-grid__cell"
      :class="getCellClass(cell)"
      @click="propagateCellClick(cell)"
    >
      <span v-if="cell.charisma">{{ cell.charisma }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HOURS_IN_DAY, Period, type IProvidePeriod } from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";

const charismaPeriodStore = useCharismaPeriodStore();

const props = defineProps({
  days: {
    type: Array as PropType<DayPresenter[]>,
    required: true,
  },
});

const findCharismaPerHour = (date: Date): number => {
  const charismaPeriod = charismaPeriodStore.all.find((cp) =>
    Period.init({ start: cp.start, end: cp.end }).isIncluding(date),
  );
  return charismaPeriod ? charismaPeriod.charisma : 0;
};

type AvailabilityCell = IProvidePeriod & {
  date: Date;
  charisma: number;
};
const gridCells = computed<AvailabilityCell[]>(() => {
  return props.days.flatMap((day) => {
    const dayStart = day.date.startOfDay();
    return Array.from({ length: HOURS_IN_DAY }, (_, hour) => {
      const start = dayStart.addHours(hour);
      const end = start.addHours(1);
      return {
        date: start,
        period: new Period({ start, end }),
        charisma: findCharismaPerHour(start),
      };
    });
  });
});

const gridTemplateStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${props.days.length}, 1fr)`,
  gridTemplateRows: `repeat(${HOURS_IN_DAY}, auto)`,
}));

const getCellClass = (cell: AvailabilityCell) => {
  return cell.charisma ? "cell--active" : "cell--inactive";
};

const emit = defineEmits(["click:event"]);
const propagateCellClick = (cell: AvailabilityCell) => {
  emit("click:event", cell);
};
</script>

<style lang="scss" scoped>
.calendar-grid {
  display: grid;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.2);

  &__cell {
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;

    &--active {
      background-color: rgba(var(--v-theme-primary), 0.3);
    }
    &--inactive {
      background-color: rgba(var(--v-theme-surface), 0.1);
    }
  }
}
</style>
