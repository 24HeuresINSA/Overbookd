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
import {
  ONE_HOUR_IN_MS,
  OverDate,
  TWO_HOURS_IN_MS,
  type InitOverDate,
} from "@overbookd/time";
import { Period } from "@overbookd/time";
import type { AvailabilityErrorMessage } from "@overbookd/volunteer-availability";
import { CalendarEventPeriods } from "~/utils/availabilities/calendar-event-periods";
import {
  CalendarEventBuilder,
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

const displayedDays = defineModel<Date[]>({ required: true });

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

const selectedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.selected as Period[],
);
const savedAvailabilities = computed<Period[]>(
  () => availabilityStore.availabilities.recorded as Period[],
);
const availabilities = computed<Period[]>(
  () => availabilityStore.availabilities.list as Period[],
);
const errors = computed<AvailabilityErrorMessage[]>(
  () => availabilityStore.availabilities.errors as AvailabilityErrorMessage[],
);

const isSaved = (period: Period): boolean => {
  return savedAvailabilities.value.some((availability) =>
    availability.includes(period),
  );
};

const calendarEvents = computed<CalendarEvent[]>(() =>
  globalPeriod.splitWithIntervalInMs(TWO_HOURS_IN_MS).flatMap((splitPeriod) => {
    const startHour = splitPeriod.start.getHours();
    const isPartyPeriod = isPartyShift(startHour);

    const periods = isPartyPeriod
      ? splitPeriod.splitWithIntervalInMs(ONE_HOUR_IN_MS)
      : [splitPeriod];

    return periods.map((period) => {
      const charismaPerHour = findCharismaPerHour(period);
      const charisma = isPartyPeriod ? charismaPerHour : charismaPerHour * 2;

      return CalendarEventBuilder.build({
        start: period.start,
        end: period.end,
        name: charisma.toString(),
        color: isSaved(period) ? "success" : "primary",
      });
    });
  }),
);

const click = (event: CalendarEvent) => {
  const date = OverDate.from(event.start) as unknown as InitOverDate;
  const charismaPerHour = findCharismaPerHour(Period.init(event));
  availabilityStore.selectAvailability(date, charismaPerHour);
};

const emit = defineEmits(["previous", "next", "validate"]);
const propagatePrevious = () => emit("previous");
const propagateNext = () => emit("next");
const propagateValidation = () => emit("validate");
</script>
