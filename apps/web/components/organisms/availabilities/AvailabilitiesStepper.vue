<template>
  <div>
    <v-stepper v-model="step" class="mb-3" editable>
      <v-stepper-header>
        <v-stepper-item
          v-for="({ title }, index) in calendarSteps"
          :key="`step-${index}`"
          :title="title"
          :complete="step > index + 1"
          :value="index + 1"
        />
      </v-stepper-header>
    </v-stepper>
    <AvailabilitiesPickCalendar
      v-model="days"
      :disable-previous="shouldDisablePrevious"
      :disable-next="shouldDisableNext"
      :cant-validate="cannotValidate"
      @previous="moveToPreviousStep"
      @next="moveToNextStep"
      @validate="saveAvailabilities"
    />
  </div>
</template>

<script lang="ts" setup>
import { HARD_CODE } from "@overbookd/team-constants";
import { Duration, OverDate } from "@overbookd/time";
import {
  CalendarEventPeriods,
  type CalendarStep,
} from "~/utils/availabilities/calendar-event-periods";
import { DayPresenter } from "~/utils/calendar/day.presenter";

const SOFT_CALENDAR_STEPS: CalendarStep[] = [
  CalendarEventPeriods.preManif,
  CalendarEventPeriods.manif,
  CalendarEventPeriods.postManif,
];
const HARD_CALENDAR_STEPS: CalendarStep[] = [
  CalendarEventPeriods.prePreManif,
  ...SOFT_CALENDAR_STEPS,
];

const userStore = useUserStore();
const availabilitiyStore = useVolunteerAvailabilityStore();

const step = ref<number>(1);

const calendarSteps = computed<CalendarStep[]>(() => {
  const isHard = (userStore.loggedUser?.teams ?? []).includes(HARD_CODE);
  return isHard ? HARD_CALENDAR_STEPS : SOFT_CALENDAR_STEPS;
});
const days = computed<DayPresenter[]>(() => {
  const calendarStep = calendarSteps.value.at(step.value - 1);
  if (!calendarStep) return [];

  const splitedStep = calendarStep.period.splitWithInterval(Duration.ONE_DAY);
  const dates = splitedStep.map(({ start }) => OverDate.from(start)) ?? [];
  const lastDate = OverDate.from(calendarStep.period.end);
  const datesWithLastDay = [...dates, lastDate];
  return datesWithLastDay.map((date) => new DayPresenter(date));
});

const cannotValidate = computed<boolean>(() => {
  const hasNoSelection =
    availabilitiyStore.availabilities.selected.length === 0;
  const hasError = availabilitiyStore.availabilities.errors.length > 0;
  return hasNoSelection || hasError;
});

const shouldDisablePrevious = computed<boolean>(() => step.value <= 1);
const shouldDisableNext = computed<boolean>(
  () => step.value >= calendarSteps.value.length,
);

const moveToPreviousStep = () => {
  if (shouldDisablePrevious.value) return;
  step.value--;
};
const moveToNextStep = () => {
  if (shouldDisableNext.value) return;
  step.value++;
};

const saveAvailabilities = async () => {
  if (!userStore.loggedUser) return;
  await availabilitiyStore.updateVolunteerAvailabilities(
    userStore.loggedUser.id,
  );
};
</script>
