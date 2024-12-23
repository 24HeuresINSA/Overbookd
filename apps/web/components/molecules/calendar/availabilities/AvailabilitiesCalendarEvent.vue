<template>
  <v-card
    class="calendar-event"
    :class="colorClass"
    :style="{
      top: `${eventManager.topPositionInPixels + 1}px`,
      height: `${eventManager.heightInPixels - 2}px`,
    }"
    hover
    @click="propagateClick"
  >
    <p class="calendar-event__charisma">{{ event.name }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";
import type { OverDate, Period } from "@overbookd/time";
import type { AvailabilityErrorMessage } from "@overbookd/volunteer-availability";
import { CalendarEventManager } from "~/utils/calendar/calendar-event.manager";

const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  displayedDay: {
    type: Object as PropType<OverDate>,
    required: true,
  },
});

const emit = defineEmits(["click"]);
const propagateClick = () => emit("click", props.event);

const eventManager = new CalendarEventManager(props.event, props.displayedDay);

const selectedAvailabilities = computed(
  () => availabilityStore.availabilities.selected as Period[],
);
const savedAvailabilities = computed(
  () => availabilityStore.availabilities.recorded as Period[],
);
const errors = computed(
  () => availabilityStore.availabilities.errors as AvailabilityErrorMessage[],
);

const isSaved = (): boolean =>
  savedAvailabilities.value.some((availability) =>
    availability.includes(eventManager.displayedEventPeriod),
  );

const isSelected = (): boolean =>
  selectedAvailabilities.value.some((availability) =>
    availability.includes(eventManager.displayedEventPeriod),
  );

const hasError = (): boolean =>
  errors.value.some((error) =>
    error.period.includes(eventManager.displayedEventPeriod),
  );

const colorClass = computed(() => {
  if (hasError()) return "error";
  if (isSaved()) return "validated";
  if (isSelected()) return "selected";
  return "unselected";
});
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
