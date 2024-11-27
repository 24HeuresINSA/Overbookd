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
      v-show="step === index + 1"
      :key="`${period.start}-${period.end}`"
    >
      <v-stepper-window-item
        :id="`calendar-part-${index + 1}`"
        :value="index + 1"
      >
        <p class="text-center">
          Les disponibilités ne sont pas encore disponibles (c'est vraiment le
          comble 😉).
        </p>
        <!--<v-btn
          text="Valider"
          color="success"
          :disabled="hasAvailabilityError"
          @click="saveAvailabilities"
        />
        <AvailabilitiesPickCalendar
          :period="period"
          :disable-next-period="shouldDisableNextOn(index + 1)"
          :disable-previous-period="shouldDisablePreviousOn(index + 1)"
          @reach:period-end="incrementStep"
          @reach:period-start="decrementStep"
        />
        <v-btn
          text="Valider"
          color="success"
          :disabled="hasAvailabilityError"
          @click="saveAvailabilities"
        />-->
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
// const availabilitiyStore = useVolunteerAvailabilityStore();

const step = ref<number>(1);

const calendarSteps = computed<CalendarStep[]>(() => {
  const isHard = (userStore.loggedUser?.teams ?? []).includes("hard");
  return isHard ? HARD_CALENDAR_STEPS : SOFT_CALENDAR_STEPS;
});
// const hasAvailabilityError = computed<boolean>(() => {
//   return availabilitiyStore.availabilities.errors.length > 0;
// });

// const shouldDisableNextOn = (periodCount: number) => {
//   const isLastPeriod = calendarSteps.value.length === periodCount;
//   return isLastPeriod;
// };
// const shouldDisablePreviousOn = (periodCount: number) => {
//   const isFirstPeriod = periodCount === 1;
//   return isFirstPeriod;
// };

// const incrementStep = () => step.value++;
// const decrementStep = () => step.value--;

// const saveAvailabilities = async () => {
//   await availabilitiyStore.updateVolunteerAvailabilities(
//     userStore.loggedUser?.id ?? 0,
//   );
// };
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
