<template>
  <div class="timeline-axis">
    <div class="axis"></div>
    <div class="markers">
      <span>{{ startHour }}</span>
      <span>{{ endHour }}</span>
    </div>
  </div>
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
  },
});
</script>

<style lang="scss" scoped>
.timeline-axis {
  position: sticky;
  top: 65px;
}
.axis {
  min-height: 50px;
  min-width: calc(100% - 20px);
  margin-left: 10px;
  margin-right: 10px;
  border-color: black;
  background-color: gray;
  border-width: 2px;
  border-left-style: solid;
  border-right-style: solid;
}

.markers {
  display: flex;
  justify-content: space-between;
  span {
    background-color: white;
  }
}
</style>
