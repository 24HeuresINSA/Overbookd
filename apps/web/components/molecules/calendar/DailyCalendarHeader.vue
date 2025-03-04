<template>
  <header
    :v-ripple="clickable"
    class="header-day"
    :class="{
      today: isToday,
      'with-daily-event': todayPublicHoliday,
      'with-arrows': displayArrows,
      clickable,
    }"
    @click="propagateClick"
  >
    <v-icon
      v-if="displayArrows"
      class="header-day__arrow"
      icon="mdi-chevron-left"
      size="large"
      @click.stop="propagatePrevious"
    />
    <div class="header-day__content">
      <p class="header-day__name">{{ day.calendarHeader.name }}</p>
      <p class="header-day__number">{{ day.calendarHeader.number }}</p>
      <v-card
        v-if="todayPublicHoliday"
        :color="todayPublicHoliday.color"
        class="header-day__daily-event"
      >
        <div class="header-day__daily-event-content">
          <span>{{ todayPublicHoliday.name }}</span>
        </div>
      </v-card>
    </div>
    <v-icon
      v-if="displayArrows"
      class="header-day__arrow"
      icon="mdi-chevron-right"
      size="large"
      @click.stop="propagateNext"
    />
  </header>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { DailyEvent } from "~/utils/calendar/event";

const publicHolidayStore = usePublicHolidayStore();

const props = defineProps({
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
  displayArrows: {
    type: Boolean,
    default: false,
  },
});

const calendarEvents = ref<DailyEvent[]>([]);
const calendarEventsCurrentYear = ref<number>(props.day.date.year);
calendarEvents.value = publicHolidayStore.calendarEventsForYear(
  calendarEventsCurrentYear.value,
);
const updateCalendarEvents = () => {
  const year = props.day.date.year;
  if (calendarEventsCurrentYear.value === year) return;
  calendarEventsCurrentYear.value = year;
  calendarEvents.value = publicHolidayStore.calendarEventsForYear(year);
};
watch(() => props.day, updateCalendarEvents, { immediate: true });

const emit = defineEmits(["click", "previous", "next"]);
const propagateClick = () => {
  if (props.clickable) emit("click", props.day);
};
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");

const publicHolidaysByDate = computed(() => {
  return calendarEvents.value.reduce(
    (acc, event) => {
      const dateKey = OverDate.from(event.start).dateString;
      acc[`${dateKey}`] = event;
      return acc;
    },
    {} as Record<string, DailyEvent>,
  );
});

const todayPublicHoliday = computed<DailyEvent | undefined>(() => {
  const dateKey = props.day.date.dateString;
  return publicHolidaysByDate.value[`${dateKey}`];
});

const isToday = computed<boolean>(() => {
  const today = OverDate.now();
  return props.day.isSameDayThan(today);
});
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.header-day {
  width: 100%;
  min-width: $calendar-day-min-width;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }
  &__name {
    font-size: 1.2rem;
  }
  &__number {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
  }
  &__daily-event {
    width: 100%;
    height: 20px;
    padding: 0 10px !important;
    margin: 0 !important;
    background-color: rgb(var(--v-theme-error));
    color: rgb(var(--v-theme-on-error));
    display: flex;
    align-items: center;
    overflow: hidden;
    &-content {
      display: flex;
      align-items: center;
      width: 100%;
      span {
        font-size: 0.75rem;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

.with-daily-event {
  padding-bottom: 5px;
}
.with-arrows {
  justify-content: space-between;
}

.today {
  color: rgb(var(--v-theme-primary));
}

.clickable:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.05);
}
</style>
