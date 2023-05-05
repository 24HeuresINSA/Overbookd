<template>
  <div class="timeline-events">
    <div v-for="event in events" :key="event.fa.id" class="timeline-event">
      <h2>{{ event.fa.name }} <TeamChip :team="event.fa.team" /></h2>
      <div
        v-for="task in event.fts"
        :key="task.id"
        class="timeline-event__task"
        :style="{
          width: computeTaskWidth(task),
          marginLeft: computeTaskLeftMargin(task),
        }"
        @click="openFtInNewTab(task.id)"
      >
        <h3>
          {{ task.name }}
          <v-icon v-show="task.hasPriority" color="orange">
            mdi-alert-circle
          </v-icon>
        </h3>
        <div
          v-for="(timeWindow, index) in task.timeWindows"
          :key="index"
          class="timewindow"
          :style="{
            width: computeTimeWindowWidth(task, timeWindow),
            marginLeft: computeTimeWindowLeftMargin(task, timeWindow),
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Period, getPeriodDuration } from "~/utils/models/period";
import {
  TimelineEvent,
  TimelineFt,
  TimelineTimeWindow,
} from "~/utils/models/timeline";
import { marginPercent, widthPercent } from "~/utils/timeline/placement";

export default Vue.extend({
  name: "TimelineEvents",
  components: { TeamChip },
  computed: {
    events(): TimelineEvent[] {
      return this.$accessor.timeline.filteredEvents;
    },
    period(): Period {
      return this.$accessor.timeline.period;
    },
    duration(): number {
      return getPeriodDuration(this.period);
    },
  },
  created() {
    this.$accessor.timeline.fetchEvents();
  },
  methods: {
    buildTaskPeriod(task: TimelineFt): Period {
      const lowestStartDate = Math.min(
        ...task.timeWindows.map(({ start }) => start.getTime())
      );
      const highestEndDate = Math.max(
        ...task.timeWindows.map(({ end }) => end.getTime())
      );
      return {
        start: new Date(Math.max(lowestStartDate, this.period.start.getTime())),
        end: new Date(Math.min(highestEndDate, this.period.end.getTime())),
      };
    },
    computeTaskWidth(task: TimelineFt): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const width = widthPercent(this.period, taskPeriod);
      return `${width.toFixed(2)}%`;
    },
    computeTimeWindowWidth(
      task: TimelineFt,
      timeWindow: TimelineTimeWindow
    ): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const width = widthPercent(taskPeriod, timeWindow);
      return `${width.toFixed(2)}%`;
    },
    computeTaskLeftMargin(task: TimelineFt): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const margin = marginPercent(this.period, taskPeriod);
      return `${margin.toFixed(2)}%`;
    },
    computeTimeWindowLeftMargin(
      task: TimelineFt,
      timeWindow: TimelineTimeWindow
    ): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const margin = marginPercent(taskPeriod, timeWindow);
      return `${margin.toFixed(2)}%`;
    },
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.timeline-events {
  min-width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .timeline-event {
    border-radius: 10px;
    background-color: $timeline-fa-content-background-color;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 5px;

    h2 {
      text-align: center;
      min-width: 100%;
      background-color: $timeline-fa-title-background-color;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    &__task {
      border-radius: 8px;
      background-color: $timeline-task-content-background-color;
      cursor: pointer;
      h3 {
        text-align: center;
        min-width: 100%;
        background-color: $timeline-task-title-background-color;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .timewindow {
        margin-top: 5px;
        min-height: 20px;
        cursor: pointer;
        background-color: $timeline-timewindow-background-color;
        border-radius: 10px;
        &:last-of-type {
          margin-bottom: 10px;
        }
        &:first-of-type {
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
