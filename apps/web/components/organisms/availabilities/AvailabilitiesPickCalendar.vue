<template>
  <OverCalendar>
    <template #manager>
      <AvailabilititesCalendarManager
        :day="days[0]"
        :disable-previous="disablePrevious"
        :disable-next="disableNext"
        :cant-validate="cantValidate"
        @previous="propagatePrevious"
        @next="propagateNext"
        @validate="propagateValidation"
      />
    </template>
    <template #header>
      <AvailabilitiesCalendarHeader :days="days" />
    </template>
    <template #content>
      <AvailabilitiesMultiDayCalendarContent
        :days="days"
        @click:event="selectOrUnselectAvailability"
      />
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { AvailabilityEvent } from "~/utils/availabilities/availabilities";

const availabilityStore = useVolunteerAvailabilityStore();

defineProps({
  disablePrevious: {
    type: Boolean,
    default: false,
  },
  disableNext: {
    type: Boolean,
    default: false,
  },
  cantValidate: {
    type: Boolean,
    default: false,
  },
});

const days = defineModel<DayPresenter[]>({ required: true });

const selectedAvailabilities = computed(
  () => availabilityStore.availabilities.selected,
);
const isSelected = (event: AvailabilityEvent): boolean => {
  return selectedAvailabilities.value.some((selected) =>
    selected.isIncluding(event.start),
  );
};
const selectOrUnselectAvailability = (availability: AvailabilityEvent) => {
  const date = OverDate.fromLocal(availability.start);
  if (isSelected(availability)) {
    return availabilityStore.unSelectAvailability(date, availability.charisma);
  }
  availabilityStore.selectAvailability(date, availability.charisma);
};

const emit = defineEmits(["previous", "next", "validate"]);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
const propagateValidation = () => emit("validate");
</script>
