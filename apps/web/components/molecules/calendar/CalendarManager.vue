<template>
  <div class="calendar-manager">
    <div class="full-buttons">
      <v-btn
        text="Aujourd'hui"
        color="primary"
        :disabled="isCurrentWeekOrDay"
        @click="moveToToday"
      />
      <v-btn
        text="Manif"
        color="primary"
        :disabled="isEventStartWeekOrDay"
        @click="moveToEventStartDay"
      />
    </div>
    <div class="arrow-buttons">
      <v-btn
        icon="mdi-chevron-left"
        variant="plain"
        size="x-large"
        density="compact"
        rounded="pill"
        @click="moveToPreviousWeekOrDay"
      />
      <v-btn
        icon="mdi-chevron-right"
        variant="plain"
        size="x-large"
        density="compact"
        rounded="pill"
        @click="moveToNextWeekOrDay"
      />
    </div>
    <h3 class="period-indicator">{{ periodIndicator }}</h3>
  </div>
</template>

<script lang="ts" setup>
import {
  isSameDay,
  isSameWeek,
  ONE_DAY_IN_MS,
  ONE_WEEK_IN_MS,
} from "@overbookd/time";
import { DAY_MODE, type CalendarMode } from "~/utils/calendar/calendar.utils";

const configurationStore = useConfigurationStore();

const props = defineProps({
  mode: {
    type: String as PropType<CalendarMode>,
    required: true,
  },
});

const displayedDay = defineModel<Date>({ required: true });
const eventStartDate = computed<Date>(() => configurationStore.eventStartDate);

const isDayMode = computed<boolean>(() => props.mode === DAY_MODE);

const periodIndicator = computed<string>(() => {
  const month = displayedDay.value.toLocaleDateString("fr-FR", {
    month: "long",
  });
  const year = displayedDay.value.getFullYear();
  return `${capitalizeFirstLetter(month)} ${year}`;
});

const isCurrentWeekOrDay = computed<boolean>(() => {
  const today = new Date();
  return isDayMode.value
    ? isSameDay(displayedDay.value, today)
    : isSameWeek(displayedDay.value, today);
});
const isEventStartWeekOrDay = computed<boolean>(() => {
  return isDayMode.value
    ? isSameDay(displayedDay.value, eventStartDate.value)
    : isSameWeek(displayedDay.value, eventStartDate.value);
});

const moveToToday = () => {
  displayedDay.value = new Date();
};
const moveToEventStartDay = () => {
  displayedDay.value = eventStartDate.value;
};

const moveToPreviousWeekOrDay = () => {
  displayedDay.value = isDayMode.value
    ? new Date(displayedDay.value.getTime() - ONE_DAY_IN_MS)
    : new Date(displayedDay.value.getTime() - ONE_WEEK_IN_MS);
};
const moveToNextWeekOrDay = () => {
  displayedDay.value = isDayMode.value
    ? new Date(displayedDay.value.getTime() + ONE_DAY_IN_MS)
    : new Date(displayedDay.value.getTime() + ONE_WEEK_IN_MS);
};
</script>

<style lang="scss" scoped>
.calendar-manager {
  display: flex;
  gap: 15px;
  align-items: center;
  .full-buttons {
    display: flex;
    gap: 10px;
  }
  .arrow-buttons {
    display: flex;
  }
  .period-indicator {
    font-size: 1.5rem;
    font-weight: normal;
    margin-top: 2px;
  }
}
</style>
