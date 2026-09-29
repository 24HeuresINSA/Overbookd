<template>
  <OverCalendar>
    <template #manager>
      <h3 class="period-indicator">{{ days[0]?.displayableMonthWithYear }}</h3>
    </template>
    <template #header>
      <AvailabilitiesCalendarHeader
        :days="days"
        @click="selectOrUnselectDay"
        @previous="propagatePrevious"
        @next="propagateNext"
      />
    </template>
    <template #content>
      <AvailabilitiesMultiDayCalendarContent
        :days="days"
        @click:availability="selectOrUnselectAvailability"
      />
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import { Duration, OverDate, Period } from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import {
  ALL_HOURS,
  type AvailabilityEvent,
} from "~/utils/availabilities/availabilities";
import { findCharismaPerHour } from "~/utils/availabilities/availability-grid.utils";

const availabilityStore = useVolunteerAvailabilityStore();
const charismaPeriodStore = useCharismaPeriodStore();

const days = defineModel<DayPresenter[]>({ required: true });

const availabilities = computed(() => availabilityStore.availabilities.list);
const charismaPeriods = computed(() => charismaPeriodStore.all);

const recordedAvailabilitites = computed(
  () => availabilityStore.availabilities.recorded,
);
const isRecorded = (date: Date): boolean => {
  return recordedAvailabilitites.value.some((recorded) =>
    recorded.isIncluding(date),
  );
};
const selectedAvailabilities = computed(
  () => availabilityStore.availabilities.selected,
);
const isSelected = (date: Date): boolean => {
  return selectedAvailabilities.value.some((selected) =>
    selected.isIncluding(date),
  );
};
const selectOrUnselectAvailability = (availability: AvailabilityEvent) => {
  const date = OverDate.fromLocal(availability.start);
  if (isSelected(availability.start)) {
    return availabilityStore.unSelectAvailability(date, availability.charisma);
  }
  availabilityStore.selectAvailability(date, availability.charisma);
};

const isAllDaySelected = (day: DayPresenter): boolean => {
  const start = day.startsAt;
  const tomorrow = start.plus(Duration.ONE_DAY).date;
  const period = Period.init({ start: start.date, end: tomorrow });
  return availabilities.value.some((availability) =>
    availability.includes(period),
  );
};
const selectOrUnselectDay = (day: DayPresenter) => {
  if (isAllDaySelected(day)) {
    ALL_HOURS.forEach((hour) => {
      const date = OverDate.init({ date: day.date.dateString, hour });
      if (isSelected(date.date) && !isRecorded(date.date)) {
        const charisma = findCharismaPerHour(charismaPeriods.value, date.date);
        availabilityStore.unSelectAvailability(date, charisma);
      }
    });
    return;
  }
  ALL_HOURS.forEach((hour) => {
    const date = OverDate.init({ date: day.date.dateString, hour });
    if (!isSelected(date.date) && !isRecorded(date.date)) {
      const charisma = findCharismaPerHour(charismaPeriods.value, date.date);
      availabilityStore.selectAvailability(date, charisma);
    }
  });
};

const emit = defineEmits(["previous", "next"]);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
</script>

<style lang="scss" scoped>
.period-indicator {
  font-size: 1.5rem;
  font-weight: normal;
  text-transform: capitalize;
  text-align: center;
}
</style>
