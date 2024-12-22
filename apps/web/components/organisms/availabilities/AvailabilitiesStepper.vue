<template>
  <div>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-item
          v-for="({ title }, index) in calendarSteps"
          :key="`step-${index}`"
          :title="title"
          :complete="step > index + 1"
          :value="index + 1"
        />
      </v-stepper-header>

      <v-stepper-window>
        <v-stepper-window-item
          v-for="(_, index) in calendarSteps"
          :key="`content-${index}`"
          :value="index + 1"
        >
          <AvailabilitiesPickCalendar
            v-model="displayedDays"
            :disable-previous="shouldDisablePrevious"
            :disable-next="shouldDisableNext"
            :cant-validate="hasAvailabilityError"
            @previous="moveToPreviousStep"
            @next="moveToNextStep"
            @validate="saveAvailabilities"
          />
        </v-stepper-window-item>
      </v-stepper-window>
    </v-stepper>
  </div>
</template>

<script lang="ts" setup>
import { HARD_CODE } from "@overbookd/team-constants";
import { ONE_DAY_IN_MS } from "@overbookd/time";
import {
  CalendarEventPeriods,
  type CalendarStep,
} from "~/utils/availabilities/calendar-event-periods";

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
const displayedDays = computed<Date[]>(() => {
  const calendarStep = calendarSteps.value.at(step.value - 1);
  const splitedStep = calendarStep?.period.splitWithIntervalInMs(ONE_DAY_IN_MS);
  return splitedStep?.map(({ start }) => start) ?? [];
});

const hasAvailabilityError = computed<boolean>(
  () => availabilitiyStore.availabilities.errors.length > 0,
);

const shouldDisablePrevious = computed<boolean>(() => step.value <= 1);
const shouldDisableNext = computed<boolean>(
  () => step.value >= calendarSteps.value.length,
);

const moveToPreviousStep = () => {
  if (step.value <= 1) return;
  step.value--;
};
const moveToNextStep = () => {
  if (step.value >= calendarSteps.value.length) return;
  step.value++;
};

const saveAvailabilities = async () => {
  await availabilitiyStore.updateVolunteerAvailabilities(
    userStore.loggedUser?.id ?? 0,
  );
};
</script>
