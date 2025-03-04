<template>
  <div>
    <v-stepper v-model="step" class="mb-3 desktop-only" editable>
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
    <h2 class="mb-3 mobile-only">
      {{ calendarSteps[step - 1].title }}
      <i>(Jour {{ mobileStepDayIndex + 1 }} sur {{ stepDays.length }})</i>
    </h2>
    <AvailabilitiesPickCalendar
      v-model="calendarDays"
      :disable-previous="shouldDisablePrevious"
      :disable-next="shouldDisableNext"
      :cant-validate="cannotValidate"
      @previous="moveToPrevious"
      @next="moveToNext"
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
const layoutStore = useLayoutStore();

const step = ref<number>(1);
const mobileStepDayIndex = ref<number>(0);

const isDesktop = computed<boolean>(() => layoutStore.isDesktop);

const calendarSteps = computed<CalendarStep[]>(() => {
  const isHard = (userStore.loggedUser?.teams ?? []).includes(HARD_CODE);
  return isHard ? HARD_CALENDAR_STEPS : SOFT_CALENDAR_STEPS;
});
const stepDays = computed<DayPresenter[]>(() => {
  const calendarStep = calendarSteps.value.at(step.value - 1);
  if (!calendarStep) return [];

  const splitedStep = calendarStep.period.splitWithInterval(Duration.ONE_DAY);
  const dates = splitedStep.map(({ start }) => OverDate.from(start)) ?? [];
  const lastDate = OverDate.from(calendarStep.period.end);
  const datesWithLastDay = [...dates, lastDate];

  return datesWithLastDay.map((date) => new DayPresenter(date));
});
const calendarDays = computed<DayPresenter[]>(() => {
  if (isDesktop.value) return stepDays.value;
  const selectedDay = stepDays.value[mobileStepDayIndex.value];
  return selectedDay ? [selectedDay] : [new DayPresenter(OverDate.now())];
});

const cannotValidate = computed<boolean>(() => {
  const hasNoSelection =
    availabilitiyStore.availabilities.selected.length === 0;
  const hasError = availabilitiyStore.availabilities.errors.length > 0;
  return hasNoSelection || hasError;
});

const shouldDisablePrevious = computed<boolean>(() => {
  const isFirstStep = step.value <= 1;
  if (isDesktop.value) return isFirstStep;
  return isFirstStep && mobileStepDayIndex.value <= 0;
});
const shouldDisableNext = computed<boolean>(() => {
  const isLastStep = step.value >= calendarSteps.value.length;
  if (isDesktop.value) return isLastStep;
  return isLastStep && mobileStepDayIndex.value >= stepDays.value.length - 1;
});

const moveToPrevious = () => {
  if (isDesktop.value && !shouldDisablePrevious.value) return step.value--;
  if (mobileStepDayIndex.value > 0) return mobileStepDayIndex.value--;
  if (step.value > 1) {
    step.value--;
    mobileStepDayIndex.value = stepDays.value.length - 1;
  }
};
const moveToNext = () => {
  if (isDesktop.value && !shouldDisableNext.value) return step.value++;
  if (mobileStepDayIndex.value < stepDays.value.length - 1) {
    return mobileStepDayIndex.value++;
  }
  if (step.value < calendarSteps.value.length) {
    step.value++;
    mobileStepDayIndex.value = 0;
  }
};

const saveAvailabilities = async () => {
  if (!userStore.loggedUser) return;
  await availabilitiyStore.updateVolunteerAvailabilities(
    userStore.loggedUser.id,
  );
};
</script>
