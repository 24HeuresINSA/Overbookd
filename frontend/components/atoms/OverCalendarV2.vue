<template>
  <v-calendar
    ref="calendar"
    :value="date"
    type="week"
    :events="events"
    :event-ripple="true"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    @change="updateDate"
  >
    <template
      #interval="{
        date: intervalDate,
        year,
        mounth,
        day,
        hour,
        minute,
        weekday,
        hasDay,
        hasTime,
        past,
        present,
        future,
        time,
        timeToY,
        timeDelta,
        minutesToPixels,
        week,
      }"
    >
      <slot
        name="interval"
        :date="intervalDate"
        :year="year"
        :mounth="mounth"
        :day="day"
        :hour="hour"
        :minute="minute"
        :weekday="weekday"
        :hasDay="hasDay"
        :hasTime="hasTime"
        :past="past"
        :present="present"
        :future="future"
        :time="time"
        :timeToY="timeToY"
        :timeDelta="timeDelta"
        :minutesToPixels="minutesToPixels"
        :week="week"
      ></slot>
      <div
        :class="{
          shift: isShiftHour(hour),
          'shift-party': isPartyHour(hour),
          'shift-day': isDayHour(hour),
          'shift-night': isNightHour(hour),
        }"
        :style="{ top: timeToY(time) }"
      ></div>
    </template>
  </v-calendar>
</template>

<script lang="ts">
import Vue from "vue";
import { SHIFT_HOURS } from "~/utils/shift/shift";

export default Vue.extend({
  name: "OverCalendarV2",
  model: {
    prop: "date",
    event: "change",
  },
  props: {
    events: {
      type: Array,
      required: true,
      default: () => [],
    },
    date: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
  },
  data() {
    return {};
  },
  methods: {
    isPartyHour(hour: number): boolean {
      return hour === SHIFT_HOURS.PARTY;
    },
    isDayHour(hour: number): boolean {
      return hour === SHIFT_HOURS.DAY;
    },
    isNightHour(hour: number): boolean {
      return hour === SHIFT_HOURS.NIGHT;
    },
    isShiftHour(hour: number): boolean {
      return (
        this.isDayHour(hour) || this.isNightHour(hour) || this.isPartyHour(hour)
      );
    },
    updateDate() {
      this.$emit("change", this.date);
    },
  },
});
</script>

<style lang="scss" scoped>
.shift {
  height: 2px;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;
  &-party {
    background-color: purple;
  }
  &-night {
    background-color: black;
  }
  &-day {
    background-color: darksalmon;
  }
}
</style>
