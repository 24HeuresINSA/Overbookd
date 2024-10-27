<template>
  <OverCalendar :events="calendarEvents" @click="click" />
</template>

<script lang="ts" setup>
import {
  CalendarEventBuilder,
  type CalendarEvent,
} from "~/utils/calendar/event";

const charismaPeriodStore = useCharismaPeriodStore();

const calendarEvents = computed<CalendarEvent[]>(() =>
  charismaPeriodStore.all.map((cp) =>
    CalendarEventBuilder.build({
      start: cp.start,
      end: cp.end,
      name: cp.charisma.toString(),
    }),
  ),
);

const click = (event: CalendarEvent) => {
  console.log("click", event);
};
</script>
