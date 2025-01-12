<template>
  <div class="daily-content">
    <v-card
      v-for="event in day.eventsOccuringThatDayAmong(events)"
      :key="event.id"
      class="calendar-event"
      :class="getColorClass(event)"
      :style="getEventStyle(event)"
      hover
      @click="propagateEventClick(event)"
    >
      <p class="calendar-event__charisma">{{ event.name }}</p>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { CalendarEvent } from "~/utils/calendar/event";
import { AvailabilityPresenter } from "~/utils/calendar/calendar.presenter";
const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  events: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
});

const emit = defineEmits(["click:event"]);
const propagateEventClick = (event: CalendarEvent) => {
  emit("click:event", event);
};

const selectedAvailabilities = computed(
  () => availabilityStore.availabilities.selected,
);
const savedAvailabilities = computed(
  () => availabilityStore.availabilities.recorded,
);
const errors = computed(() => availabilityStore.availabilities.errors);

const getColorClass = (event: CalendarEvent) => {
  const presenter = new AvailabilityPresenter(event, props.day);
  const isSaved = savedAvailabilities.value.some((availability) =>
    availability.includes(presenter.displayedEventPeriod),
  );
  const isSelected = selectedAvailabilities.value.some((availability) =>
    availability.includes(presenter.displayedEventPeriod),
  );
  const hasError = errors.value.some((error) =>
    error.period.includes(presenter.displayedEventPeriod),
  );

  if (hasError) return "error";
  if (isSaved) return "validated";
  if (isSelected) return "selected";
  return "unselected";
};

const getEventStyle = (event: CalendarEvent) => {
  const presenter = new AvailabilityPresenter(event, props.day);
  return presenter.css;
};
</script>

<style lang="scss" scoped>
.daily-content {
  position: relative;
}

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
