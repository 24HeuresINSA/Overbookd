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
    <h3 class="period-indicator">{{ periodIndicator }}</h3>
  </div>
</template>

<script lang="ts" setup>
import { isSameDay, isSameWeek } from "@overbookd/time";

const configurationStore = useConfigurationStore();

const props = defineProps({
  dayMode: {
    type: Boolean,
    default: false,
  },
});

const displayedDay = defineModel<Date>({ required: true });
const eventStartDate = computed<Date>(() => configurationStore.eventStartDate);

const periodIndicator = computed<string>(() => {
  const month = displayedDay.value.toLocaleDateString("fr-FR", {
    month: "long",
  });
  const year = displayedDay.value.getFullYear();
  return `${capitalizeFirstLetter(month)} ${year}`;
});

const isCurrentWeekOrDay = computed<boolean>(() => {
  const today = new Date();
  return props.dayMode
    ? isSameDay(displayedDay.value, today)
    : isSameWeek(displayedDay.value, today);
});
const isEventStartWeekOrDay = computed<boolean>(() => {
  return props.dayMode
    ? isSameDay(displayedDay.value, eventStartDate.value)
    : isSameWeek(displayedDay.value, eventStartDate.value);
});

const moveToToday = () => {
  displayedDay.value = new Date();
};
const moveToEventStartDay = () => {
  displayedDay.value = eventStartDate.value;
};

const emit = defineEmits(["previous", "next"]);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
</script>

<style lang="scss" scoped>
.calendar-manager {
  display: flex;
  gap: 5px;
  align-items: center;
  flex-wrap: wrap;
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
