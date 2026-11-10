<template>
  <OverCalendar>
    <template #manager>
      <AvailabilitiesCalendarManager
        :day="day as DayPresenter"
        :loading="loading"
        @previous="moveToPrevious"
        @next="moveToNext"
      />
    </template>
    <template #header>
      <AvailabilitiesCalendarHeader
        :days="day.weekDays as DayPresenter[]"
        @click="selectOrUnselectDay"
      />
    </template>
    <template #content>
      <AvailabilitiesWeekSumupCalendarContent
        :day="day as DayPresenter"
        :manager="availabilities as Availabilities"
        @click:availability="selectOrUnselectAvailability"
      />
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import { Duration, OverDate, Period } from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";
import { ALL_HOURS } from "~/utils/availabilities/availabilities";
import { Availabilities } from "@overbookd/volunteer-availability";

const configurationStore = useConfigurationStore();

const { loading } = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const availabilities = defineModel<Availabilities>({ required: true });

const eventStartDate = computed<OverDate>(() =>
  OverDate.from(configurationStore.eventStartDate),
);
const day = ref<DayPresenter>(new DayPresenter(eventStartDate.value));

const moveToPrevious = () => {
  day.value = new DayPresenter(day.value.date.minus(Duration.ONE_WEEK));
};
const moveToNext = () => {
  day.value = new DayPresenter(day.value.date.plus(Duration.ONE_WEEK));
};

const isSelected = (date: Date): boolean =>
  availabilities.value.list.some((availability) =>
    availability.isIncluding(date),
  );

const selectOrUnselectAvailability = (period: Period) => {
  if (loading) return;
  const date = OverDate.from(period.start);
  const aggregate = availabilities.value;
  availabilities.value = isSelected(date.date)
    ? aggregate.unselect(date)
    : aggregate.select(date);
};
const selectOrUnselectDay = (day: DayPresenter) => {
  if (loading) return;
  const start = day.startsAt;
  const tomorrow = start.plus(Duration.ONE_DAY).date;
  const period = Period.init({ start: start.date, end: tomorrow });
  const isAllSelected = availabilities.value.list.some((availability) =>
    availability.includes(period),
  );
  availabilities.value = ALL_HOURS.reduce((aggregate, hour) => {
    const date = OverDate.init({ date: day.date.dateString, hour });
    return isAllSelected ? aggregate.unselect(date) : aggregate.select(date);
  }, availabilities.value);
};
</script>
