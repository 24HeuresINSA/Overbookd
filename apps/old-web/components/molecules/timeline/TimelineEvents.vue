<template>
  <div class="timeline-events">
    <div
      v-for="event in events"
      :key="event.activity.id"
      class="timeline-event"
    >
      <h2>
        {{ event.activity.name }} <TeamChip :team="event.activity.team" />
      </h2>
      <div
        v-for="task in event.tasks"
        :key="task.id"
        class="timeline-event__task"
        :style="{
          width: computeTaskWidth(task),
          marginLeft: computeTaskLeftMargin(task),
        }"
      >
        <h3 @click="openFtInNewTab(task.id)">
          {{ task.name }}
          <v-icon v-show="task.topPriority" color="orange">
            mdi-alert-circle
          </v-icon>
        </h3>
        <div
          v-for="(mobilization, index) in task.mobilizations"
          :key="index"
          class="mobilization"
          :style="{
            width: computeMobilizationWidth(task, mobilization),
            marginLeft: computeMobilizationLeftMargin(task, mobilization),
          }"
        >
          <div
            v-for="assignment in mobilization.assignments"
            :key="`${index}-${assignment.start.getTime()}-${assignment.end.getTime()}`"
            class="assignment"
            :style="{
              width: computeAssignmentWidth(mobilization, assignment),
            }"
            @click="openAssignmentDetailsDialog(task, assignment)"
          ></div>
        </div>
      </div>
    </div>
    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <TimelineAssignmentDetails
        v-if="selected"
        :task="selected.task"
        :assignment="selected.assignment"
        @close-dialog="closeAssignmentDetailsDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IProvidePeriod } from "@overbookd/period";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import TimelineAssignmentDetails from "~/components/molecules/timeline/TimelineAssignmentDetails.vue";
import { marginPercent, widthPercent } from "~/utils/timeline/placement";
import {
  TimelineAssignment,
  TimelineEvent,
  TimelineMobilization,
  TimelineTask,
} from "@overbookd/http";

type TimelineEventsData = {
  displayAssignmentDetailsDialog: boolean;
  selected?: {
    task: TimelineTask;
    assignment: TimelineAssignment;
  };
};

export default defineComponent({
  name: "TimelineEvents",
  components: { TeamChip, TimelineAssignmentDetails },
  data: (): TimelineEventsData => ({
    displayAssignmentDetailsDialog: false,
    selected: undefined,
  }),
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
    buildTaskPeriod(task: TimelineTask): IProvidePeriod {
      const lowestStartDate = Math.min(
        ...task.mobilizations.map(({ start }) => start.getTime()),
      );
      const highestEndDate = Math.max(
        ...task.mobilizations.map(({ end }) => end.getTime()),
      );
      return {
        start: new Date(Math.max(lowestStartDate, this.range.start.getTime())),
        end: new Date(Math.min(highestEndDate, this.range.end.getTime())),
      };
    },
    adjustPeriodToRange(period: IProvidePeriod): IProvidePeriod {
      const periodStart = period.start.getTime();
      const rangeStart = this.range.start.getTime();
      const periodEnd = period.end.getTime();
      const rangeEnd = this.range.end.getTime();

      const start = new Date(Math.max(periodStart, rangeStart));
      const end = new Date(Math.min(periodEnd, rangeEnd));

      return { start, end };
    },
    computeTaskWidth(task: TimelineTask): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const width = widthPercent(this.range, taskPeriod);
      return `${width.toFixed(2)}%`;
    },
    computeMobilizationWidth(
      task: TimelineTask,
      mobilization: TimelineMobilization,
    ): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const mobilizationPeriod = this.adjustPeriodToRange(mobilization);
      const width = widthPercent(taskPeriod, mobilizationPeriod);
      return `${width.toFixed(2)}%`;
    },
    computeAssignmentWidth(
      mobilization: TimelineMobilization,
      assignment: IProvidePeriod,
    ): string {
      const mobilizationPeriod = this.adjustPeriodToRange(mobilization);
      const assignmentPeriod = this.adjustPeriodToRange(assignment);
      const width = widthPercent(mobilizationPeriod, assignmentPeriod);
      return `${width.toFixed(2)}%`;
    },
    computeTaskLeftMargin(task: TimelineTask): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const margin = marginPercent(this.range, taskPeriod);
      return `${margin.toFixed(2)}%`;
    },
    computeMobilizationLeftMargin(
      task: TimelineTask,
      mobilization: TimelineMobilization,
    ): string {
      const taskPeriod = this.buildTaskPeriod(task);
      const margin = marginPercent(taskPeriod, mobilization);
      return `${margin.toFixed(2)}%`;
    },
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
    openAssignmentDetailsDialog(
      task: TimelineTask,
      assignment: TimelineAssignment,
    ) {
      this.selected = { task, assignment };
      this.displayAssignmentDetailsDialog = true;
    },
    closeAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = false;
      this.selected = undefined;
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
    background-color: $timeline-activity-content-background-color;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 5px;

    h2 {
      text-align: center;
      min-width: 100%;
      background-color: $timeline-activity-title-background-color;
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
      .mobilization {
        --mobilization-height: 20px;
        margin-top: 5px;
        min-height: var(--mobilization-height);
        cursor: pointer;
        background-color: $timeline-mobilization-background-color;
        border-radius: calc(var(--mobilization-height) / 2);
        display: flex;
        &:last-of-type {
          margin-bottom: 10px;
        }
        &:first-of-type {
          margin-top: 10px;
        }
        .assignment {
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
