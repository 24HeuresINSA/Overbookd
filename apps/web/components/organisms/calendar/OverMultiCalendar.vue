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
          <v-icon
            v-if="!displayAllVolunteers"
            class="multi-calendar__volunteers__arrow"
            icon="mdi-chevron-left"
            aria-label="Page précédente"
            title="Page précédente"
            size="large"
            :disabled="isFirstPage"
            @click="previousPage"
          />
          <slot
            v-for="volunteer in displayedVolunteers"
            :key="volunteer.id"
            name="volunteer-header"
            :volunteer="volunteer"
          />
          <v-icon
            v-if="!displayAllVolunteers"
            class="multi-calendar__volunteers__arrow with-border"
            icon="mdi-chevron-right"
            aria-label="Page suivante"
            title="Page suivante"
            size="large"
            :disabled="isLastPage"
            @click="nextPage"
          />
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
          <div v-if="!displayAllVolunteers" class="multi-calendar__padding" />
          <DailyCalendarContent
            v-for="volunteer in displayedVolunteers"
            :key="volunteer.id"
            :day="day"
            :events="withEventToAdd(volunteer.assignments)"
            :availabilities="volunteer.availabilities"
            class="multi-calendar__volunteer"
          />
          <div
            v-if="!displayAllVolunteers"
            class="multi-calendar__padding with-border"
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

const page = defineModel<number>("page", { default: 0 });

const { volunteers, eventToAdd, volunteersPerPage } = defineProps({
  volunteers: {
    type: Array as PropType<VolunteerForCalendar[]>,
    default: () => [],
  },
  eventToAdd: {
    type: Object as PropType<CalendarEvent | undefined>,
    default: () => undefined,
  },
  volunteersPerPage: {
    type: Number,
    default: 10,
  },
});

const displayedVolunteersStartIndex = computed<number>(
  () => page.value * volunteersPerPage,
);
const displayAllVolunteers = computed<boolean>(() => volunteersPerPage === -1);
const displayedVolunteers = computed<VolunteerForCalendar[]>(() =>
  displayAllVolunteers.value
    ? volunteers
    : volunteers.slice(
        displayedVolunteersStartIndex.value,
        displayedVolunteersStartIndex.value + volunteersPerPage,
      ),
);

const isFirstPage = computed<boolean>(() => page.value <= 0);
const previousPage = () => {
  if (isFirstPage.value) return;
  page.value -= 1;
};
const isLastPage = computed<boolean>(
  () =>
    displayedVolunteersStartIndex.value + volunteersPerPage >=
    volunteers.length,
);
const nextPage = () => {
  if (isLastPage.value) return;
  page.value += 1;
};

const withEventToAdd = (assignments: CalendarEvent[]): CalendarEvent[] => {
  return eventToAdd ? [...assignments, eventToAdd] : assignments;
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

  if (sourceEl && targetEl) targetEl.scrollLeft = sourceEl.scrollLeft;

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
  display: flex;
  justify-content: center;
  overflow-x: auto;
}

.multi-calendar__volunteers {
  display: flex;
  flex-wrap: nowrap;
  width: 100%;

  &__arrow {
    align-self: center;
    font-size: 3rem;
    min-width: 3.5rem;
    width: 100%;
    height: 100%;
  }
}

.multi-calendar__padding {
  min-width: 3.5rem;
  width: 100%;
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

.with-border {
  box-sizing: border-box;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.2);
}
</style>
