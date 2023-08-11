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
            v-for="timeSpan in timeWindow.timeSpans"
            :key="timeSpan.id"
            class="timespan"
            :style="{
              width: computeTimeSpanWidth(timeWindow, timeSpan),
            }"
            @click="openTimeSpanDetailsDialog(timeSpan.id)"
          ></div>
        </div>
      </div>
    </div>
    <v-dialog v-model="displayTimeSpanDetailsDialog" width="1000px">
      <FtTimeSpanDetails @close-dialog="closeTimeSpanDetailsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IProvidePeriod } from "@overbookd/period";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import FtTimeSpanDetails from "~/components/organisms/festivalEvent/ft/FtTimeSpanDetails.vue";
import {
  TimelineEvent,
  TimelineFt,
  TimelineTimeWindow,
  TimelineTimeSpan,
} from "~/utils/models/timeline";
import { marginPercent, widthPercent } from "~/utils/timeline/placement";

export default Vue.extend({
  name: "TimelineEvents",
  components: { TeamChip, FtTimeSpanDetails },
  data: () => {
    return {
      displayTimeSpanDetailsDialog: false,
    };
  },
  computed: {
    events(): TimelineEvent[] {
      return this.$accessor.timeline.filteredEvents;
    },
    range(): IProvidePeriod {
      return this.$accessor.timeline.period;
    },
  },
  created() {
    this.$accessor.timeline.fetchEvents();
  },
  methods: {
    buildTaskPeriod(task: TimelineFt): IProvidePeriod {
      const lowestStartDate = Math.min(
        ...task.timeWindows.map(({ start }) => start.getTime())
      );
      const highestEndDate = Math.max(
        ...task.timeWindows.map(({ end }) => end.getTime())
      );
      return {
        start: new Date(Math.max(lowestStartDate, this.range.start.getTime())),
        end: new Date(Math.min(highestEndDate, this.range.end.getTime())),
      };
    },
    adjustPeriodToRange(period: IProvidePeriod): IProvidePeriod {
      const PeriodStart = period.start.getTime();
      const rangeStart = this.range.start.getTime();
      const periodEnd = period.end.getTime();
      const rangeEnd = this.range.end.getTime();

      const start = new Date(Math.max(PeriodStart, rangeStart));
      const end = new Date(Math.min(periodEnd, rangeEnd));

      return { start, end };
    },
    computeTaskWidth(task: TimelineFt): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const width = widthPercent(this.range, taskPeriod);
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
    computeTimeSpanWidth(
      timeWindow: TimelineTimeWindow,
      timeSpan: TimelineTimeSpan
    ): string {
      const timeWindowPeriod = this.adjustPeriodToRange(timeWindow);
      const timeSpanPeriod = this.adjustPeriodToRange(timeSpan);
      const width = widthPercent(timeWindowPeriod, timeSpanPeriod);
      return `${width.toFixed(2)}%`;
    },
    computeTaskLeftMargin(task: TimelineFt): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const margin = marginPercent(this.range, taskPeriod);
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
    openTimeSpanDetailsDialog(timeSpanId: number) {
      this.$accessor.assignment.fetchTimeSpanDetails(timeSpanId);
      this.displayTimeSpanDetailsDialog = true;
    },
    closeTimeSpanDetailsDialog() {
      this.displayTimeSpanDetailsDialog = false;
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
        color: white;
        text-transform: capitalize;
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
