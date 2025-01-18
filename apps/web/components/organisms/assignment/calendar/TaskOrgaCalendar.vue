<template>
  <div class="task-orga-calendar">
    <h3>{{ taskName }}</h3>
    <OverCalendar v-model="calendarMarker" :events="assignments" />
  </div>
</template>

<script lang="ts" setup>
import type {
  AssignmentSummary,
  AssignmentTeam,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { type CalendarEventWithIdentifier } from "~/utils/assignment/calendar-event";

const teamStore = useTeamStore();
const configurationStore = useConfigurationStore();
const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

const calendarMarker = ref<Date>(new Date());
const eventStartDate = computed<Date>(() => configurationStore.eventStartDate);
onMounted(() => (calendarMarker.value = eventStartDate.value));

const selectedTask = computed<TaskWithAssignmentsSummary | null>(
  () => assignTaskToVolunteerStore.selectedTask,
);
const taskName = computed<string>(() =>
  selectedTask.value
    ? `[${selectedTask.value.id}] ${selectedTask.value.name}`
    : "",
);

const assignments = computed<CalendarEvent[]>(() =>
  (selectedTask.value?.assignments ?? []).flatMap((assignment) =>
    mapAssignmentToEvent(assignment),
  ),
);

const buildEventName = (team: AssignmentTeam): string => {
  return `[${team.assigned}/${team.demand}] ${team.team}`;
};
const getTeamColor = (code: string): string => {
  return teamStore.getTeamByCode(code)?.color ?? "blue";
};
const decimalToHex = (decimal: number): string => {
  const hex = Math.round(decimal).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};
const defineEventColor = (team: AssignmentTeam): string => {
  const color = getTeamColor(team.team);
  const spread = (180 * team.assigned) / team.demand + 75;
  return color + decimalToHex(spread);
};
const mapAssignmentToEvent = (
  assignment: AssignmentSummary,
): CalendarEventWithIdentifier[] => {
  return assignment.teams.map((team) =>
    createCalendarEvent({
      ...assignment,
      name: buildEventName(team),
      timed: true,
      color: defineEventColor(team),
      identifier: {
        assignmentId: assignment.assignmentId,
        mobilizationId: assignment.mobilizationId,
        taskId: assignment.taskId,
      },
    }),
  );
};
</script>

<style lang="scss" scoped>
.task-orga-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}
</style>
