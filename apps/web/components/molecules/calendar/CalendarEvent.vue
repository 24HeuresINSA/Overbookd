<template>
  <v-card
    class="calendar-event"
    :class="{ unclickable: !clickable, 'event-selected': event.selected }"
    :color="event.color || 'primary'"
    :style="presenter.css"
    :href="clickable ? event.link : undefined"
    :ripple="clickable"
    @click="propagateClick"
    @contextmenu.prevent="propagateRightClick"
  >
    <v-tooltip activator="parent" location="top">
      <CalendarEventContent :name="event.name" :hour="presenter.periodText" />
    </v-tooltip>
    <CalendarEventContent :name="event.name" :hour="presenter.periodText" />
  </v-card>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";
import { CalendarEventPresenter } from "~/utils/calendar/calendar.presenter";
import type { DayPresenter } from "~/utils/calendar/day.presenter";

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  day: {
    type: Object as PropType<DayPresenter>,
    required: true,
  },
  among: {
    type: Object as PropType<CalendarEvent[]>,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click", "click-right"]);
const propagateClick = () => {
  if (props.clickable) emit("click", props.event);
};
const propagateRightClick = () => {
  if (props.clickable) emit("click-right", props.event);
};

const presenter = computed<CalendarEventPresenter>(() => {
  return new CalendarEventPresenter(props.event, props.day, props.among);
});
</script>

<style lang="scss" scoped>
.calendar-event {
  position: absolute;
  margin: 0 !important;
  border-radius: 6px !important;
}

.event-selected {
  border: 2px solid rgba(var(--v-theme-on-surface), 0.7);
}
</style>
