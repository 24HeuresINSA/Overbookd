<template>
  <header class="header">
    <v-btn
      icon="mdi-chevron-left"
      variant="plain"
      size="x-large"
      density="comfortable"
      rounded="pill"
      @click="moveToPreviousDay"
    />
    <div class="header__day" :class="{ today }">
      <p class="header__day-name">{{ displayableDay.name }}</p>
      <p class="header__day-number">{{ displayableDay.number }}</p>
    </div>
    <v-btn
      icon="mdi-chevron-right"
      variant="plain"
      size="x-large"
      density="comfortable"
      rounded="pill"
      @click="moveToNextDay"
    />
  </header>
</template>

<script lang="ts" setup>
import { ONE_DAY_IN_MS } from "@overbookd/time";
import { isToday, type CalendarDay } from "~/utils/calendar/calendar.utils";

const currentDay = defineModel<Date>({ required: true });

const displayableDay = computed<CalendarDay>(() => {
  const name = currentDay.value
    .toLocaleDateString("fr-FR", { weekday: "long" })
    .toUpperCase();
  const number = currentDay.value.getDate();
  return { name, number };
});

const moveToPreviousDay = () => {
  currentDay.value = new Date(currentDay.value.getTime() - ONE_DAY_IN_MS);
};
const moveToNextDay = () => {
  currentDay.value = new Date(currentDay.value.getTime() + ONE_DAY_IN_MS);
};

const today = computed<boolean>(() => isToday(currentDay.value));
</script>

<style lang="scss" scoped>
@import "./calendar.scss";

.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-row: 1;
  grid-column: 2;
  border-top-right-radius: $calendar-radius;
  border-left: 1px solid rgb(var(--v-theme-on-surface));

  &__day {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 10px;

    &-name {
      font-size: 1.2rem;
    }
    &-number {
      font-size: 2rem;
      font-weight: 700;
      line-height: 1.1;
    }
  }

  .today {
    color: rgb(var(--v-theme-primary));
  }
}
</style>
