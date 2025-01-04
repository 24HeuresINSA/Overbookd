<template>
  <v-card
    class="calendar-event"
    :class="colorClass"
    :style="style"
    hover
    @click="propagateClick"
  >
    <p class="calendar-event__charisma">{{ event.name }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";
import type { Period } from "@overbookd/time";
import type { AvailabilityErrorMessage } from "@overbookd/volunteer-availability";
import { AvailabilityPresenter } from "~/utils/calendar/calendar.presenter";
import type { DayPresenter } from "~/utils/calendar/day.presenter";

const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
});

const emit = defineEmits(["click"]);
const propagateClick = () => emit("click", props.event);

const presenter = new AvailabilityPresenter(props.event, props.day);

const selectedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.selected as Period[],
);
const savedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.recorded as Period[],
);
const errors = computed<AvailabilityErrorMessage[]>(
  () => availabilityStore.availabilities.errors as AvailabilityErrorMessage[],
);

const isSaved = computed<boolean>(() =>
  savedAvailabilities.value.some((availability) =>
    availability.includes(presenter.displayedEventPeriod),
  ),
);
const isSelected = computed<boolean>(() =>
  selectedAvailabilities.value.some((availability) =>
    availability.includes(presenter.displayedEventPeriod),
  ),
);
const hasError = computed<boolean>(() =>
  errors.value.some((error) =>
    error.period.includes(presenter.displayedEventPeriod),
  ),
);

const colorClass = computed(() => {
  if (hasError.value) return "error";
  if (isSaved.value) return "validated";
  if (isSelected.value) return "selected";
  return "unselected";
});
const style = computed(() => ({
  left: presenter.left.css,
  width: presenter.width.css,
}));
</script>

<style lang="scss" scoped>
.calendar-event {
  position: absolute;
  width: 100%;
  margin: 0 !important;
  border-radius: 6px !important;
  padding: 8px 3px 8px 10px !important;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  justify-content: center;
  text-align: center;

  &__charisma {
    width: 100%;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.validated {
  background-color: rgb(var(--v-theme-success));
  color: rgb(var(--v-theme-on-success));
}
.selected {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
.unselected {
  background-color: rgba(var(--v-theme-primary), 0.3);
  color: rgb(var(--v-theme-on-surface));
}
.error {
  background-color: rgb(var(--v-theme-error));
  color: rgb(var(--v-theme-on-error));
}
</style>
