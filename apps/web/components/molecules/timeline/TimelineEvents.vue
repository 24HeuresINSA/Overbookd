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
          <v-icon
            v-show="task.topPriority"
            icon="mdi-alert-circle"
            aria-label="Tâche prioritaire"
            title="Tâche prioritaire"
            color="tertiary"
          />
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
          />
        </div>
      </div>
    </div>

    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <TimelineAssignmentDetailsDialogCard
        v-if="selected"
        :task="selected.task"
        :assignment="selected.assignment"
        @close="closeAssignmentDetailsDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { IProvidePeriod } from "@overbookd/time";
import {
  marginPercent,
  widthPercent,
} from "~/utils/timeline/timeline-placement.utils";
import type {
  TimelineAssignment,
  TimelineEvent,
  TimelineMobilization,
  TimelineTask,
} from "@overbookd/http";
import { FT_URL } from "@overbookd/web-page";
import { openPageWithIdInNewTab } from "~/utils/navigation/router.utils";

const timelineStore = useTimelineStore();
timelineStore.fetchEvents();

type TaskAndAssignment = {
  task: TimelineTask;
  assignment: TimelineAssignment;
};
const selected = ref<TaskAndAssignment | undefined>();

const events = computed<TimelineEvent[]>(() => timelineStore.filteredEvents);
const range = computed<IProvidePeriod>(() => timelineStore.period);

const buildTaskPeriod = (task: TimelineTask): IProvidePeriod => {
  const lowestStartDate = Math.min(
    ...task.mobilizations.map(({ start }) => start.getTime()),
  );
  const highestEndDate = Math.max(
    ...task.mobilizations.map(({ end }) => end.getTime()),
  );
  return {
    start: new Date(Math.max(lowestStartDate, range.value.start.getTime())),
    end: new Date(Math.min(highestEndDate, range.value.end.getTime())),
  };
};

const adjustPeriodToRange = (period: IProvidePeriod): IProvidePeriod => {
  const periodStart = period.start.getTime();
  const rangeStart = range.value.start.getTime();
  const periodEnd = period.end.getTime();
  const rangeEnd = range.value.end.getTime();

  const start = new Date(Math.max(periodStart, rangeStart));
  const end = new Date(Math.min(periodEnd, rangeEnd));

  return { start, end };
};

const computeTaskWidth = (task: TimelineTask): string => {
  const taskPeriod = buildTaskPeriod(task);
  const width = widthPercent(range.value, taskPeriod);
  return `${width.toFixed(2)}%`;
};

const computeMobilizationWidth = (
  task: TimelineTask,
  mobilization: TimelineMobilization,
): string => {
  const taskPeriod = buildTaskPeriod(task);
  const mobilizationPeriod = adjustPeriodToRange(mobilization);
  const width = widthPercent(taskPeriod, mobilizationPeriod);
  return `${width.toFixed(2)}%`;
};

const computeAssignmentWidth = (
  mobilization: TimelineMobilization,
  assignment: IProvidePeriod,
): string => {
  const mobilizationPeriod = adjustPeriodToRange(mobilization);
  const assignmentPeriod = adjustPeriodToRange(assignment);
  const width = widthPercent(mobilizationPeriod, assignmentPeriod);
  return `${width.toFixed(2)}%`;
};

const computeTaskLeftMargin = (task: TimelineTask): string => {
  const taskPeriod = buildTaskPeriod(task);
  const margin = marginPercent(range.value, taskPeriod);
  return `${margin.toFixed(2)}%`;
};

const computeMobilizationLeftMargin = (
  task: TimelineTask,
  mobilization: TimelineMobilization,
): string => {
  const taskPeriod = buildTaskPeriod(task);
  const margin = marginPercent(taskPeriod, mobilization);
  return `${margin.toFixed(2)}%`;
};

const openFtInNewTab = (ftId: number) => {
  openPageWithIdInNewTab(FT_URL, ftId);
};

const displayAssignmentDetailsDialog = ref<boolean>(false);
const openAssignmentDetailsDialog = (
  task: TimelineTask,
  assignment: TimelineAssignment,
) => {
  selected.value = { task, assignment };
  displayAssignmentDetailsDialog.value = true;
};
const closeAssignmentDetailsDialog = () => {
  displayAssignmentDetailsDialog.value = false;
  selected.value = undefined;
};
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
    background-color: rgba(var(--v-theme-primary), 0.2);
    border: 1px solid rgb(var(--v-theme-primary));
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 5px;

    h2 {
      text-align: center;
      min-width: 100%;
      background-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    &__task {
      border-radius: 8px;
      background-color: rgba(var(--v-theme-secondary), 0.4);
      border: 1px solid rgb(var(--v-theme-secondary));
      h3 {
        cursor: pointer;
        text-align: center;
        min-width: 100%;
        background-color: rgb(var(--v-theme-secondary));
        color: rgb(var(--v-theme-on-secondary));
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        text-transform: capitalize;
      }
      .mobilization {
        --mobilization-height: 20px;
        margin-top: 5px;
        min-height: var(--mobilization-height);
        cursor: pointer;
        background-color: rgb(var(--v-theme-tertiary));
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
