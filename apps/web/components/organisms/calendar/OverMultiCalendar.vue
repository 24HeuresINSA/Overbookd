<template>
  <OverCalendar
    v-model="dayModel"
    :mode="DAY_MODE"
    class="multi-calendar"
    display-day-in-manager
  >
    <template #additional-actions>
      <slot name="additional-actions" />
    </template>
    <template #header>
      <div
        ref="headerScrollRef"
        class="multi-calendar__scroll"
        @scroll="syncScroll(HEADER)"
      >
        <div class="multi-calendar__volunteers">
          <slot name="volunteer-header" class="multi-calendar__volunteer" />
        </div>
      </div>
    </template>

    <template #content>
      <div
        ref="contentScrollRef"
        class="multi-calendar__scroll"
        @scroll="syncScroll(CONTENT)"
      >
        <div class="multi-calendar__volunteers">
          <DailyCalendarContent
            v-for="volunteer in volunteers"
            :key="volunteer.id"
            :day="day"
            :events="withEventToAdd(volunteer.assignments)"
            :availabilities="volunteer.availabilities"
            class="multi-calendar__volunteer"
          />
        </div>
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import { OverDate } from "@overbookd/time";
import { DayPresenter } from "~/utils/calendar/day.presenter";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import type { CalendarEvent } from "~/utils/calendar/event";
import { DAY_MODE } from "~/utils/calendar/calendar-mode";

const dayModel = defineModel<Date>({
  default: OverDate.now().date,
});
const day = computed<DayPresenter>({
  get: () => new DayPresenter(OverDate.fromLocal(dayModel.value)),
  set: (value) => (dayModel.value = value.date.date),
});

const props = defineProps({
  volunteers: {
    type: Array as PropType<VolunteerForCalendar[]>,
    default: () => [],
  },
  eventToAdd: {
    type: Object as PropType<CalendarEvent | undefined>,
    default: () => undefined,
  },
});

const withEventToAdd = (assignments: CalendarEvent[]): CalendarEvent[] => {
  return props.eventToAdd ? [...assignments, props.eventToAdd] : assignments;
};

const headerScrollRef = ref<HTMLElement | null>(null);
const contentScrollRef = ref<HTMLElement | null>(null);
const isSyncingScroll = ref<boolean>(false);

const HEADER = "header";
const CONTENT = "content";

const syncScroll = (source: typeof HEADER | typeof CONTENT) => {
  if (isSyncingScroll.value) return;
  isSyncingScroll.value = true;

  const sourceEl =
    source === HEADER ? headerScrollRef.value : contentScrollRef.value;
  const targetEl =
    source === HEADER ? contentScrollRef.value : headerScrollRef.value;

  if (sourceEl && targetEl) {
    targetEl.scrollLeft = sourceEl.scrollLeft;
  }

  requestAnimationFrame(() => {
    isSyncingScroll.value = false;
  });
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multi-calendar {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.multi-calendar__scroll {
  overflow-x: auto;
  width: 100%;
}

.multi-calendar__volunteers {
  display: flex;
  flex-wrap: nowrap;
  width: fit-content;
}

.multi-calendar__volunteer {
  flex: 0 0 150px;
  width: 150px;
  box-sizing: border-box;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.2);

  &:first-child {
    border-left: none;
  }
}
</style>
