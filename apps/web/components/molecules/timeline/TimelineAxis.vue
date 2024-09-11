<template>
  <div class="timeline-axis" :class="{ 'theme--dark': isDarkTheme }">
    <div class="axis" />
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

<script lang="ts" setup>
import { Period, formatDateWithHoursAndMinutesOnly } from "@overbookd/time";

const timelineStore = useTimelineStore();
const themeStore = useThemeStore();

const NB_MARKERS = 9;

const period = computed<Period>(() => timelineStore.period);

const markers = computed<string[]>(() => {
  const periodDuration = period.value.duration.inMilliseconds;
  const stepDuration = periodDuration / (NB_MARKERS - 1);
  return new Array(NB_MARKERS).fill(null).map((_, index) => {
    const startInMs = timelineStore.start.getTime();
    const stepDate = new Date(startInMs + index * stepDuration);
    return formatDateWithHoursAndMinutesOnly(stepDate);
  });
});

const isDarkTheme = computed<boolean>(() => themeStore.isDark);

const isOdd = (num: number): boolean => num % 2 === 1;
</script>

<style lang="scss" scoped>
.timeline-axis {
  position: sticky;
  top: 0;
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
  min-height: 40px;
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
    background-color: rgb(var(--v-theme-background));
    border-radius: 0 0 5px 5px;
    padding: 2px;
    @media only screen and (max-width: $mobile-max-width) {
      &.desktop {
        display: none;
      }
    }
  }
}
</style>
