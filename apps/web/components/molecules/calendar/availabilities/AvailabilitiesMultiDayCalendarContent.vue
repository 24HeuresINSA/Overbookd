<template>
  <div class="calendar-grid clickable" :style="gridTemplateStyle">
    <div
      v-for="(cell, index) in gridCells"
      :key="index"
      class="calendar-grid__cell"
      :class="getColorClass(cell)"
      @click="propagateCellClick(cell)"
    >
      <span>{{ cell.charisma }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { HOURS_IN_DAY, OverDate, Period, type Hour } from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { AvailabilityCell } from "~/utils/availabilities/availabilities";

const charismaPeriodStore = useCharismaPeriodStore();
const availabilityStore = useVolunteerAvailabilityStore();

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

const gridCells = computed<AvailabilityCell[]>(() => {
  return props.days.flatMap((day) => {
    const dayStart = day.startsAt;
    return Array.from({ length: HOURS_IN_DAY }, (_, hour) => {
      const start = OverDate.init({
        date: dayStart.dateString,
        hour: hour as Hour,
      });
      const end = OverDate.init({
        date: dayStart.dateString,
        hour: (hour + 1) as Hour,
      });
      return {
        start: start.date,
        end: end.date,
        charisma: findCharismaPerHour(start.date),
      };
    });
  });
});

const gridTemplateStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${props.days.length}, 1fr)`,
  gridTemplateRows: `repeat(${HOURS_IN_DAY}, auto)`,
}));

const selectedAvailabilities = computed(
  () => availabilityStore.availabilities.selected,
);
const savedAvailabilities = computed(
  () => availabilityStore.availabilities.recorded,
);
const errors = computed(() => availabilityStore.availabilities.errors);
const getColorClass = ({ start, end }: AvailabilityCell) => {
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

  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  }
}

.validated {
  background-color: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-on-success));
}
.selected {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
.unselected {
  background-color: rgba(var(--v-theme-primary), 0.3);
  color: rgb(var(--v-theme-on-surface));
  &:hover {
    background-color: rgba(var(--v-theme-primary, 0.9));
  }
}
.error {
  background-color: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
}
</style>
