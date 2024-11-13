<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-item
        v-for="({ title }, index) in calendarSteps"
        :key="`step-${index}`"
        :title="title"
        :complete="step > index"
        :value="index + 1"
      />
    </v-stepper-header>

    <v-stepper-window
      v-for="({ period }, index) in calendarSteps"
      :key="`${period.start}-${period.end}`"
    >
      <v-stepper-window-item
        :id="`calendar-part-${index + 1}`"
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
</template>

<script lang="ts" setup>
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

const displayedDays = ref<Date[]>([new Date()]);
const step = ref<number>(1);

const calendarSteps = computed<CalendarStep[]>(() => {
  const isHard = (userStore.loggedUser?.teams ?? []).includes("hard");
  return isHard ? HARD_CALENDAR_STEPS : SOFT_CALENDAR_STEPS;
});
const hasAvailabilityError = computed<boolean>(() => {
  return availabilitiyStore.availabilities.errors.length > 0;
});

const shouldDisableNext = computed<boolean>(() => false);
const shouldDisablePrevious = computed<boolean>(() => false);

const moveToPreviousStep = () => step.value--;
const moveToNextStep = () => step.value++;

const saveAvailabilities = async () => {
  await availabilitiyStore.updateVolunteerAvailabilities(
    userStore.loggedUser?.id ?? 0,
  );
};
</script>

<style lang="scss" scoped>
@media only screen and (max-width: $mobile-max-width) {
  @for $index from 1 through 5 {
    #calendar-part-#{$index} {
      padding: 5px 0 16px 0;
    }
  }
}
</style>
