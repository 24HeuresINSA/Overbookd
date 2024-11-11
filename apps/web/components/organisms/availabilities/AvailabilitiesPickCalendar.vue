<template>
  <OverCalendar :events="calendarEvents" @event-click="click" />
</template>

<script lang="ts" setup>
import { ONE_HOUR_IN_MS, TWO_HOURS_IN_MS } from "@overbookd/time";
import { Period } from "@overbookd/time";
import { CalendarEventPeriods } from "~/utils/availabilities/calendar-event-periods";
import {
  CalendarEventBuilder,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { isPartyShift } from "~/utils/shift";

const charismaPeriodStore = useCharismaPeriodStore();

const globalPeriod = Period.init({
  start: CalendarEventPeriods.prePreManif.period.start,
  end: CalendarEventPeriods.postManif.period.end,
});

const calendarEvents: CalendarEvent[] = globalPeriod
  .splitWithIntervalInMs(TWO_HOURS_IN_MS)
  .flatMap((splitPeriod) => {
    const startHour = splitPeriod.start.getHours();
    const isPartyPeriod = isPartyShift(startHour);

    const periods = isPartyPeriod
      ? splitPeriod.splitWithIntervalInMs(ONE_HOUR_IN_MS)
      : [splitPeriod];

    return periods.map((period) => {
      const charismaPeriod = charismaPeriodStore.all.find((cp) =>
        Period.init({ start: cp.start, end: cp.end }).isIncluding(period.start),
      );
      const charismaPerHour = charismaPeriod ? charismaPeriod.charisma : 0;
      const charisma = isPartyPeriod ? charismaPerHour : charismaPerHour * 2;

      return CalendarEventBuilder.build({
        start: period.start,
        end: period.end,
        name: charisma.toString(),
      });
    });
  });

const click = (event: CalendarEvent) => {
  console.log("click", event);
};
</script>
