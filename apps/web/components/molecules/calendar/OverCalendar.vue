<template>
  <v-calendar
    :model-value="[date]"
    :events="events"
    view-mode="week"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    class="calendar"
  />
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";

defineProps({
  events: {
    type: Array as () => CalendarEvent[],
    default: () => [],
  },
});

const date = defineModel<Date>({ default: new Date() });
</script>

<style lang="scss" scoped>
.calendar {
  background-color: rgb(var(--theme-surface));
}
</style>
