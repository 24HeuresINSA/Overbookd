<template>
  <v-card
    class="calendar-event"
    :class="{ unclickable: !clickable }"
    :color="event.color || 'primary'"
    :style="style"
    :href="event.link"
    @click="propagateClick"
  >
    <p class="calendar-event__name">{{ event.name }}</p>
    <p class="calendar-event__hour">{{ presenter.periodText }}</p>
  </v-card>
</template>

<script lang="ts" setup>
import type { CalendarEvent } from "~/utils/calendar/event";
import { CalendarEventPresenter } from "~/utils/calendar/calendar.presenter";
import type { DayPresenter } from "~/utils/calendar/day.presenter";
import type { WithAtLeastOneItem } from "@overbookd/list";

const props = defineProps({
  event: {
    type: Object as PropType<CalendarEvent>,
    required: true,
  },
  day: {
    type: Object as PropType<DayPresenter>,
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

const notEmptyOverlappingEvents = (
  props.overlappingEvents.length > 0 ? props.overlappingEvents : [props.event]
) as WithAtLeastOneItem<CalendarEvent>;
const presenter = new CalendarEventPresenter(
  props.event,
  props.day,
  notEmptyOverlappingEvents,
);
const style = computed(() => ({
  top: presenter.top.css,
  left: presenter.left.css,
  height: presenter.height.css,
  width: presenter.width.css,
}));
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
