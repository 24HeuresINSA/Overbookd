<template>
  <v-card
    class="calendar-event"
    :class="{ unclickable: !clickable }"
    :color="event.color || 'primary'"
    :style="{
      top: `${eventManager.topPositionInPixels + 1}px`,
      left: `${eventManager.leftInPercentage + 1}%`,
      height: `${eventManager.heightInPixels - 2}px`,
      width: `${eventManager.widthInPercentage - 2}%`,
    }"
    :href="event.link"
    @click="propagateClick"
  >
    <p class="calendar-event__name">{{ event.name }}</p>
    <p class="calendar-event__hour">{{ eventManager.periodText }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";
import { OverDate } from "@overbookd/time";
import { CalendarEventManager } from "~/utils/calendar/calendar-event.manager";

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  displayedDay: {
    type: Object as PropType<OverDate>,
    required: true,
  },
  overlappingEvents: {
    type: Array as PropType<CalendarEvent[]>,
    required: true,
  },
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["click"]);
const propagateClick = () => {
  if (props.clickable) emit("click", props.event);
};

const eventManager = new CalendarEventManager(
  props.event,
  props.displayedDay,
  props.overlappingEvents,
);
</script>

<style lang="scss" scoped>
.calendar-event {
  position: absolute;
  margin: 0 !important;
  border-radius: 6px !important;
  padding: 8px 3px 8px 10px !important;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__name {
    font-size: 0.85rem;
    font-weight: bold;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__hour {
    font-size: 0.75rem;
    line-height: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
