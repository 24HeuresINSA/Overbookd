<template>
  <div class="calendar-manager">
    <div class="full-buttons">
      <v-btn
        text="Aujourd'hui"
        color="primary"
        :disabled="isCurrentWeekOrDay"
        @click="moveToToday"
      />
      <v-btn
        text="Manif"
        color="primary"
        :disabled="isEventStartWeekOrDay"
        @click="moveToEventStartDay"
      />
    </div>
    <div class="arrow-buttons desktop-only">
      <v-btn
        icon="mdi-chevron-left"
        variant="plain"
        size="x-large"
        density="compact"
        rounded="pill"
        @click="propagatePrevious"
      />
      <v-btn
        icon="mdi-chevron-right"
        variant="plain"
        size="x-large"
        density="compact"
        rounded="pill"
        @click="propagateNext"
      />
    </div>
    <h3 class="period-indicator capitalize">
      {{ displayablePeriod }}
    </h3>
    <slot name="additional-actions" />
  </div>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";

const configurationStore = useConfigurationStore();

const props = defineProps({
  dayMode: {
    type: Boolean,
    default: false,
  },
});

const day = defineModel<DayPresenter>({ required: true });
const eventStartDate = computed<OverDate>(() =>
  OverDate.fromLocal(configurationStore.eventStartDate),
);

const today = OverDate.now();
const isCurrentWeekOrDay = computed<boolean>(() =>
  props.dayMode
    ? day.value.isSameDayThan(today)
    : day.value.isSameWeekThan(today),
);

const eventStartOverDay = OverDate.fromLocal(configurationStore.eventStartDate);
const isEventStartWeekOrDay = computed<boolean>(() =>
  props.dayMode
    ? day.value.isSameDayThan(eventStartOverDay)
    : day.value.isSameWeekThan(eventStartOverDay),
);

const moveToToday = () => {
  day.value = new DayPresenter(OverDate.now());
};
const moveToEventStartDay = () => {
  day.value = new DayPresenter(eventStartDate.value);
};

const displayablePeriod = computed<string>(() =>
  props.dayMode
    ? day.value.displayableDate
    : day.value.displayableMonthWithYear,
);

const emit = defineEmits(["previous", "next"]);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
</script>

<style lang="scss" scoped>
.calendar-manager {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap-reverse;
  justify-content: left;
  @media (max-width: $mobile-max-width) {
    justify-content: center;
  }
  .full-buttons {
    display: flex;
    gap: 10px;
  }
  .arrow-buttons {
    display: flex;
  }
  .period-indicator {
    font-size: 1.5rem;
    font-weight: normal;
  }
}
</style>
