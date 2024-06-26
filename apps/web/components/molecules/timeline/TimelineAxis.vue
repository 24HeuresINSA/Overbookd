<template>
  <div class="timeline-axis" :class="{ 'theme--dark': isDarkTheme }">
    <div class="axis"></div>
    <div class="markers">
      <span
        v-for="(marker, index) in markers"
        :key="index"
        :class="{ desktop: isOdd(index) }"
      >
        {{ marker }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Period } from "@overbookd/period";
import { formatDateWithHoursAndMinutesOnly } from "~/utils/date/date.utils";

const NB_MARKERS = 9;

export default Vue.extend({
  name: "TimelineAxis",
  computed: {
    startHour(): string {
      return formatDateWithHoursAndMinutesOnly(this.$accessor.timeline.start);
    },
    endHour(): string {
      return formatDateWithHoursAndMinutesOnly(this.$accessor.timeline.end);
    },
    period(): Period {
      return this.$accessor.timeline.period;
    },
    markers(): string[] {
      const periodDuration = this.period.duration.inMilliseconds;
      const stepDuration = periodDuration / (NB_MARKERS - 1);
      return new Array(NB_MARKERS).fill(null).map((_, index) => {
        const startInMs = this.$accessor.timeline.start.getTime();
        const stepDate = new Date(startInMs + index * stepDuration);
        return formatDateWithHoursAndMinutesOnly(stepDate);
      });
    },
    isDarkTheme(): boolean {
      return this.$accessor.theme.darkTheme;
    },
  },
  methods: {
    isOdd(num: number): boolean {
      return num % 2 === 1;
    },
  },
});
</script>

<style lang="scss" scoped>
.timeline-axis {
  position: sticky;
  top: $header-height;
  @media (width <= 900px) {
    top: $mobile-header-height;
  }
  z-index: 1;
  &.theme--dark {
    .axis {
      border-color: white;
      background-color: hsl(0, 0%, 75%);
    }
    .markers span {
      background-color: black;
    }
  }
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
    @media (width <= 900px) {
      &.desktop {
        display: none;
      }
    }
  }
}
</style>
