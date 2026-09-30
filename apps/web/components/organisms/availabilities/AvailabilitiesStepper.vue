<template>
  <div class="availabilities-stepper">
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
    <div class="mb-3 mobile-only">
      <v-chip-group
        :model-value="step"
        mandatory
        selected-class="text-primary"
        @update:model-value="selectStep"
      >
        <v-chip
          v-for="({ title }, index) in calendarSteps"
          :key="`step-${index}`"
          :text="title"
          :value="index + 1"
          variant="outlined"
          filter
        />
      </v-chip-group>
      <p class="hint">
        Jour {{ mobileStepDayIndex + 1 }} sur {{ stepDays.length }} · glisse
        pour changer de jour
      </p>
    </div>
    <div v-touch="{ left: moveToNext, right: moveToPrevious }">
      <AvailabilitiesPickCalendar
        v-model="calendarDays"
        @previous="moveToPrevious"
        @next="moveToNext"
      />
    </div>
    <BottomActionBar>
      <v-btn
        class="desktop-only"
        icon="mdi-chevron-left"
        aria-label="Période précédente"
        title="Période précédente"
        variant="tonal"
        :disabled="shouldDisablePrevious"
        @click="moveToPrevious"
      />
      <v-btn
        text="Valider mes dispos"
        color="success"
        size="large"
        class="action-bar__validate"
        :disabled="cannotValidate"
        :loading="isSaving"
        @click="openValidationDialog"
      />
      <v-btn
        class="desktop-only"
        icon="mdi-chevron-right"
        aria-label="Période suivante"
        title="Période suivante"
        variant="tonal"
        :disabled="shouldDisableNext"
        @click="moveToNext"
      />
      <ul class="legend action-bar__legend">
        <li v-for="{ label, className } in LEGEND" :key="className">
          <span class="legend__swatch" :class="className" />
          {{ label }}
        </li>
      </ul>
    </BottomActionBar>

    <v-dialog v-model="isValidationDialogOpen" max-width="600">
      <ConfirmationDialogCard
        @close="closeValidationDialog"
        @confirm="saveAvailabilities"
      >
        <template #title>Valider mes dispos</template>
        <template #statement>
          Tu es sur le point de valider tes disponibilités. Une fois
          sauvegardées, elles
          <strong class="text-error">ne pourront plus être modifiées</strong>.
          <br />
          Es-tu sûr·e de vouloir continuer ?
        </template>
        <template #confirm-btn-content>
          <v-icon icon="mdi-checkbox-marked-circle-outline" left /> Valider
        </template>
      </ConfirmationDialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Duration, OverDate } from "@overbookd/time";
import { ENTER_EXTENDED_AVAILABILITITES } from "@overbookd/permission";
import {
  CalendarEventPeriods,
  type CalendarStep,
} from "~/utils/availabilities/calendar-event-periods";
import { DayPresenter } from "~/utils/calendar/day.presenter";
import { useEventListener } from "@vueuse/core";

const BASE_CALENDAR_STEPS: CalendarStep[] = [
  CalendarEventPeriods.preManif,
  CalendarEventPeriods.manif,
  CalendarEventPeriods.postManif,
];
const EXTENDED_CALENDAR_STEPS: CalendarStep[] = [
  ...CalendarEventPeriods.collages,
  CalendarEventPeriods.prePreManif,
  ...BASE_CALENDAR_STEPS,
];

const LEGEND = [
  { label: "Sélectionné", className: "selected" },
  { label: "Sauvegardé", className: "validated" },
  { label: "Moins de 2h", className: "error" },
];

const myStore = useMyStore();
const availabilitiyStore = useVolunteerAvailabilityStore();
const layoutStore = useLayoutStore();

const step = ref<number>(1);
const mobileStepDayIndex = ref<number>(0);

const isDesktop = computed<boolean>(() => layoutStore.isDesktop);

const calendarSteps = computed<CalendarStep[]>(() => {
  const canViewExtended = myStore.can(ENTER_EXTENDED_AVAILABILITITES);
  return canViewExtended ? EXTENDED_CALENDAR_STEPS : BASE_CALENDAR_STEPS;
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

const selectStep = (value: unknown) => {
  step.value = Number(value);
  mobileStepDayIndex.value = 0;
};

useEventListener("keydown", (event: KeyboardEvent) => {
  if ((event.target as HTMLElement).closest("input, textarea")) return;
  if (event.key === "ArrowLeft") moveToPrevious();
  if (event.key === "ArrowRight") moveToNext();
});

const isValidationDialogOpen = ref<boolean>(false);
const openValidationDialog = () => (isValidationDialogOpen.value = true);
const closeValidationDialog = () => (isValidationDialogOpen.value = false);

const isSaving = ref<boolean>(false);
const saveAvailabilities = async () => {
  closeValidationDialog();
  if (!myStore.loggedUser) return;
  isSaving.value = true;
  await availabilitiyStore.updateVolunteerAvailabilities(myStore.loggedUser.id);
  isSaving.value = false;
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.hint {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.action-bar {
  &__validate {
    flex: 0 0 auto;
  }
  &__legend {
    order: -1;
    flex: 1;
  }

  @media screen and (max-width: $mobile-max-width) {
    &__validate {
      flex: 1;
    }
    &__legend {
      order: 1;
      width: 100%;
      flex: none;
      justify-content: center;
      font-size: 0.8rem;
    }
  }
}

.legend {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  li {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  &__swatch {
    width: 14px;
    height: 14px;
    border-radius: 4px;
    pointer-events: none;
  }
}
</style>
