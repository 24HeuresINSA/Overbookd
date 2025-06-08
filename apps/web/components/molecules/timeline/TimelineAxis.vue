<template>
  <div class="timeline-axis">
    <div class="axis-container">
      <div class="axis" />
      <span
        class="current-line"
        :style="{ left: currentPositionInPercentage + '%' }"
      />
    </div>
    <div class="markers">
      <span
        v-for="(marker, index) in markers"
        :key="index"
        :class="{ 'desktop-only': isOdd(index) }"
      >
        {{ marker }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ONE_MINUTE_IN_MS,
  Period,
  formatDateWithHoursAndMinutesOnly,
} from "@overbookd/time";
import { isOdd, percentBetween } from "~/utils/number.utils";

const timelineStore = useTimelineStore();

const NB_MARKERS = 9;
const period = computed<Period>(() => timelineStore.period);

const now = ref(new Date());
const timer = ref<ReturnType<typeof setInterval>>();

onMounted(() => {
  timer.value = setInterval(() => (now.value = new Date()), ONE_MINUTE_IN_MS);
});
onBeforeUnmount(() => clearInterval(timer.value));

const currentPositionInPercentage = computed<number>(() => {
  const startMs = timelineStore.start.getTime();
  const endMs = startMs + period.value.duration.inMilliseconds;
  return percentBetween(now.value.getTime(), startMs, endMs);
});

const markers = computed<string[]>(() => {
  const periodDuration = period.value.duration.inMilliseconds;
  const stepDuration = periodDuration / (NB_MARKERS - 1);
  const startMs = timelineStore.start.getTime();
  return Array.from({ length: NB_MARKERS }, (_, i) => {
    const date = new Date(startMs + i * stepDuration);
    return formatDateWithHoursAndMinutesOnly(date);
  });
});
</script>

<style lang="scss" scoped>
.timeline-axis {
  position: sticky;
  top: 0;
  z-index: 1;
}

.axis-container {
  position: relative;
  margin: 0 15px;
}

.axis {
  height: 40px;
  background-color: rgba(var(--v-theme-on-background), 0.4);
  border-left: 2px solid rgb(var(--v-theme-on-background));
  border-right: 2px solid rgb(var(--v-theme-on-background));
}

.current-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: red;
  transform: translateX(-50%);
}

.markers {
  display: flex;
  justify-content: space-between;
  span {
    background-color: rgb(var(--v-theme-background));
    border-radius: 0 0 5px 5px;
    padding: 2px;
  }
}
</style>
