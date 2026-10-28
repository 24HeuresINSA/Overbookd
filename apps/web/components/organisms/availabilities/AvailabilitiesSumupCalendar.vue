<template>
  <OverCalendar>
    <template #manager>
      <AvailabilitiesCalendarManager
        :day="day as DayPresenter"
        :loading="loading"
        @previous="propagatePrevious"
        @next="propagateNext"
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
        :manager="availabilitiesAggregate as Availabilities"
        @click:availability="selectOrUnselectAvailability"
      />
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import {
  Duration,
  OverDate,
  Period,
  type IProvidePeriod,
} from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";
import { ALL_HOURS } from "~/utils/availabilities/availabilities";
import { Availabilities } from "@overbookd/volunteer-availability";

const availabilityStore = useVolunteerAvailabilityStore();
const configurationStore = useConfigurationStore();

const props = defineProps({
  volunteerId: {
    type: Number,
    required: true,
  },
});

const availabilitiesAggregate = defineModel<Availabilities>({ required: true });
const initialPeriods = ref<IProvidePeriod[]>([]);

const loading = ref<boolean>(false);

const eventStartDate = computed<OverDate>(() =>
  OverDate.from(configurationStore.eventStartDate),
);
const day = ref<DayPresenter>(new DayPresenter(eventStartDate.value));

watch(
  () => props.volunteerId,
  async (volunteerId) => {
    loading.value = true;
    availabilityStore.clearVolunteerAvailabilities();
    day.value = new DayPresenter(eventStartDate.value);

    await availabilityStore.fetchVolunteerAvailabilities(volunteerId);
    const fetchedPeriods = availabilityStore.availabilities.list as Period[];
    availabilitiesAggregate.value = Availabilities.init({
      selected: fetchedPeriods,
      recorded: [],
    });
    initialPeriods.value = fetchedPeriods;
    loading.value = false;
  },
  { immediate: true },
);

const selected = computed<Period[]>(
  () => availabilitiesAggregate.value.list as Period[],
);
const isSelected = (date: Date): boolean => {
  return selected.value.some((availability) => availability.isIncluding(date));
};

const selectOrUnselectAvailability = (period: Period) => {
  const date = OverDate.from(period.start);
  availabilitiesAggregate.value = isSelected(date.date)
    ? availabilitiesAggregate.value.unselect(date)
    : availabilitiesAggregate.value.select(date);
};

const selectOrUnselectDay = (day: DayPresenter) => {
  const isAllSelected = isSelected(day.startsAt.date);
  ALL_HOURS.forEach((hour) => {
    const date = OverDate.init({ date: day.date.dateString, hour });
    availabilitiesAggregate.value = isAllSelected
      ? availabilitiesAggregate.value.unselect(date)
      : availabilitiesAggregate.value.select(date);
  });
};

const propagatePrevious = () => {
  const previous = day.value.date.minus(Duration.ONE_WEEK);
  day.value = new DayPresenter(previous);
};
const propagateNext = () => {
  const next = day.value.date.plus(Duration.ONE_WEEK);
  day.value = new DayPresenter(next);
};
</script>
