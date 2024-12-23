<template>
  <OverCalendar v-if="displayedDays.length > 0">
    <template #manager>
      <AvailabilititesCalendarManager
        :displayed-day="displayedDays[0]"
        :disable-previous="disablePrevious"
        :disable-next="disableNext"
        :cant-validate="cantValidate"
        @previous="propagatePrevious"
        @next="propagateNext"
        @validate="propagateValidation"
      />
    </template>
    <template #header>
      <AvailabilitiesCalendarHeader :displayed-days="displayedDays" />
    </template>
    <template #content>
      <AvailabilitiesMultiDayCalendarContent
        :events="calendarEvents"
        :displayed-days="displayedDays"
        @click:event="click"
      />
    </template>
  </OverCalendar>
</template>

<script lang="ts" setup>
import { ONE_HOUR_IN_MS, OverDate, TWO_HOURS_IN_MS } from "@overbookd/time";
import { Period } from "@overbookd/time";
import { CalendarEventPeriods } from "~/utils/availabilities/calendar-event-periods";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { isPartyShift } from "~/utils/shift.utils";

const charismaPeriodStore = useCharismaPeriodStore();
const availabilityStore = useVolunteerAvailabilityStore();

defineProps({
  disablePrevious: {
    type: Boolean,
    default: false,
  },
  disableNext: {
    type: Boolean,
    default: false,
  },
  cantValidate: {
    type: Boolean,
    default: false,
  },
});

const displayedDays = defineModel<OverDate[]>({ required: true });

const globalPeriod = Period.init({
  start: CalendarEventPeriods.prePreManif.period.start,
  end: CalendarEventPeriods.postManif.period.end,
});

const findCharismaPerHour = (period: Period): number => {
  const charismaPeriod = charismaPeriodStore.all.find((cp) =>
    Period.init({ start: cp.start, end: cp.end }).isIncluding(period.start),
  );
  return charismaPeriod ? charismaPeriod.charisma : 0;
};

const intervals = globalPeriod.splitWithIntervalInMs(TWO_HOURS_IN_MS);
const calendarEvents = computed<CalendarEvent[]>(() =>
  intervals.flatMap((splitPeriod) => {
    const startHour = splitPeriod.start.getHours();
    const isPartyPeriod = isPartyShift(startHour);

    const periods = isPartyPeriod
      ? splitPeriod.splitWithIntervalInMs(ONE_HOUR_IN_MS)
      : [splitPeriod];

    return periods.map((period) => {
      const charismaPerHour = findCharismaPerHour(period);
      const charisma = isPartyPeriod ? charismaPerHour : charismaPerHour * 2;

      return createCalendarEvent({
        start: period.start,
        end: period.end,
        name: charisma.toString(),
      });
    });
  }),
);

const selectedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.selected as Period[],
);
const isSelected = (event: CalendarEvent): boolean => {
  return selectedAvailabilities.value.some((selected) =>
    selected.isIncluding(event.start),
  );
};
const click = (event: CalendarEvent) => {
  const date = OverDate.from(event.start);
  const charismaPerHour = +event.name;

  if (isSelected(event)) {
    return availabilityStore.unSelectAvailability(date, charismaPerHour);
  }
  availabilityStore.selectAvailability(date, charismaPerHour);
};

const emit = defineEmits(["previous", "next", "validate"]);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
const propagateValidation = () => emit("validate");
</script>
