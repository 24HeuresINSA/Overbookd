<template>
  <div class="timeline-axis" :style="cssVars"></div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithHoursAndMinutesOnly } from "~/utils/date/dateUtils";

export default Vue.extend({
  name: "TimelineAxis",
  computed: {
    startHour(): string {
      return formatDateWithHoursAndMinutesOnly(this.$accessor.timeline.start);
    },
    endHour(): string {
      return formatDateWithHoursAndMinutesOnly(this.$accessor.timeline.end);
    },
    // for css variables that should be in the string format to work correctly you should use JSON.stringify()
    // cf: https://stackoverflow.com/questions/66409308/dynamic-styling-for-pseudo-elements-content-in-vue2-x#answer-66409733
    cssVars(): Record<string, string> {
      return {
        "--start": JSON.stringify(this.startHour),
        "--end": JSON.stringify(this.endHour),
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.timeline-axis {
  min-width: calc(100% - 20px);
  min-height: 50px;
  border-color: black;
  background-color: gray;
  border-width: 2px;
  border-left-style: solid;
  border-right-style: solid;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
  position: sticky;
  top: 65px;
  &::after,
  &::before {
    position: relative;
    top: 50px;
    background-color: white;
  }
  &::after {
    content: var(--end);
    left: calc(100vw - 105px);
  }
  &::before {
    content: var(--start);
    left: -20px;
  }
}
</style>
