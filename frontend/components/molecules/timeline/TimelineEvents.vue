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
      >
        <h3 @click="openFtInNewTab(task.id)">
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
        >
          <div
            v-for="timespan in timeWindow.timespans"
            :key="timespan.id"
            class="timespan"
            :style="{
              width: computeTimespanWidth(timeWindow, timespan),
            }"
            @click="openTimespanDetailsDialog(timespan.id)"
          ></div>
        </div>
      </div>
    </div>
    <v-dialog v-model="displayTimespanDetailsDialog" width="1000px">
      <FTTimespanDetails @close-dialog="closeTimespanDetailsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import FTTimespanDetails from "~/components/organisms/festivalEvent/ft/FTTimespanDetails.vue";
import { Period, getPeriodDuration } from "~/utils/models/period";
import {
  TimelineEvent,
  TimelineFt,
  TimelineTimeWindow,
  TimelineTimespan,
} from "~/utils/models/timeline";
import { marginPercent, widthPercent } from "~/utils/timeline/placement";

export default Vue.extend({
  name: "TimelineEvents",
  components: { TeamChip, FTTimespanDetails },
  data: () => {
    return {
      displayTimespanDetailsDialog: false,
    };
  },
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
    adjustPeriodToRange(timeWindow: Period): Period {
      const timeWindowStart = timeWindow.start.getTime();
      const periodStart = this.period.start.getTime();
      const timeWindowEnd = timeWindow.end.getTime();
      const periodEnd = this.period.end.getTime();

      const start = new Date(Math.max(timeWindowStart, periodStart));
      const end = new Date(Math.min(timeWindowEnd, periodEnd));

      return { start, end };
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
      const timeWindowPeriod = this.adjustPeriodToRange(timeWindow);
      const width = widthPercent(taskPeriod, timeWindowPeriod);
      return `${width.toFixed(2)}%`;
    },
    computeTimespanWidth(
      timeWindow: TimelineTimeWindow,
      timespan: TimelineTimespan
    ): string {
      const timeWindowPeriod = this.adjustPeriodToRange(timeWindow);
      const timespanPeriod = this.adjustPeriodToRange(timespan);
      const width = widthPercent(timeWindowPeriod, timespanPeriod);
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
    openTimespanDetailsDialog(timespanId: number) {
      this.$accessor.assignment.fetchTimespanDetails(timespanId);
      this.displayTimespanDetailsDialog = true;
    },
    closeTimespanDetailsDialog() {
      this.displayTimespanDetailsDialog = false;
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
      h3 {
        cursor: pointer;
        text-align: center;
        min-width: 100%;
        background-color: $timeline-task-title-background-color;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
      .timewindow {
        --time-window-height: 20px;
        margin-top: 5px;
        min-height: var(--time-window-height);
        cursor: pointer;
        background-color: $timeline-timewindow-background-color;
        border-radius: calc(var(--time-window-height) / 2);
        display: flex;
        &:last-of-type {
          margin-bottom: 10px;
        }
        &:first-of-type {
          margin-top: 10px;
        }
        .timespan {
          min-height: 100%;
          border-right-color: black;
          border-right-width: 3px;
          border-right-style: solid;
          &:first-of-type {
            border-bottom-left-radius: calc(var(--time-window-height) / 2);
            border-top-left-radius: calc(var(--time-window-height) / 2);
          }
          &:last-of-type {
            border-bottom-right-radius: calc(var(--time-window-height) / 2);
            border-top-right-radius: calc(var(--time-window-height) / 2);
            border-right: none;
          }
        }
      }
    }
  }
}
</style>
