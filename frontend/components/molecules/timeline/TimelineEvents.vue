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
        <h3>{{ task.name }}</h3>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Period, getPeriodDuration } from "~/utils/models/period";
import { TimelineEvent, TimelineFt } from "~/utils/models/timeline";

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
        ...task.timespans.map(({ start }) => start.getTime())
      );
      const highestEndDate = Math.max(
        ...task.timespans.map(({ end }) => end.getTime())
      );
      return {
        start: new Date(Math.max(lowestStartDate, this.period.start.getTime())),
        end: new Date(Math.min(highestEndDate, this.period.end.getTime())),
      };
    },
    widthPercent(task: TimelineFt): number {
      const taskPeriod = this.buildTaskPeriod(task);
      const taskDuration = getPeriodDuration(taskPeriod);
      const durationRatio = (taskDuration / this.duration) * 100;
      const remainingWidthPercent = 100 - this.marginPercent(task);
      return Math.min(durationRatio, remainingWidthPercent);
    },
    computeTaskWidth(task: TimelineFt): string {
      const widthPercent = this.widthPercent(task);
      return `${widthPercent.toFixed(2)}%`;
    },
    marginPercent(task: TimelineFt): number {
      const taskPeriod = this.buildTaskPeriod(task);
      const idleDuration =
        taskPeriod.start.getTime() - this.period.start.getTime();
      const durationRatio = (idleDuration / this.duration) * 100;
      return Math.max(durationRatio, 0);
    },
    computeTaskLeftMargin(task: TimelineFt): string {
      const marginPercent = this.marginPercent(task);
      return `${marginPercent.toFixed(2)}%`;
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
      min-height: 100px;
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
    }
  }
}
</style>
