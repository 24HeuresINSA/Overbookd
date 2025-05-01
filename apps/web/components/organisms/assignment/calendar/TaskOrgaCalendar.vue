<template>
  <div class="task-orga-calendar">
    <h3>{{ taskName }}</h3>
    <OverCalendar
      v-model="calendarMarker"
      :events="assignments"
      clickable-events
      class="task-orga-calendar__calendar"
      :can-use-calendar-shortcuts="props.canUseCalendarShortcuts"
      @click:event="selectAssignment"
      @click-right:event="openAssignmentDetails"
    />
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
import {
  hasAssignmentIdentifier,
  type CalendarEventWithIdentifier,
} from "~/utils/assignment/calendar-event";

const props = defineProps({
  canUseCalendarShortcuts: {
    type: Boolean,
    default: true,
  },
});

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
  const teamName = teamStore.getTeamByCode(team.team)?.name ?? team.team;
  return `[${team.assigned}/${team.demand}] ${teamName}`;
};

const decimalToHex = (decimal: number): string => {
  const hex = Math.round(decimal).toString(16);
  return hex.length === 1 ? "0" + hex : hex;
};
const defineEventColor = (team: AssignmentTeam): string => {
  const color = teamStore.getTeamByCode(team.team)?.color ?? "#000000";
  const spread = (180 * team.assigned) / team.demand + 75;
  return color + decimalToHex(spread);
};
const isSelected = (assignmentId: string) =>
  assignTaskToVolunteerStore.selectedAssignment?.assignmentId === assignmentId;
const mapAssignmentToEvent = (
  assignment: AssignmentSummary,
): CalendarEventWithIdentifier[] => {
  return assignment.teams.map((team) =>
    createCalendarEvent({
      ...assignment,
      name: buildEventName(team),
      timed: true,
      color: defineEventColor(team),
      selected: isSelected(assignment.assignmentId),
      identifier: {
        assignmentId: assignment.assignmentId,
        mobilizationId: assignment.mobilizationId,
        taskId: assignment.taskId,
      },
    }),
  );
};

const selectAssignment = (
  event: CalendarEvent | CalendarEventWithIdentifier,
) => {
  if (!hasAssignmentIdentifier(event)) return;
  assignTaskToVolunteerStore.selectAssignment(event.identifier);
};

const emit = defineEmits(["open-assignment-details"]);
const openAssignmentDetails = (
  event: CalendarEvent | CalendarEventWithIdentifier,
) => {
  if (!hasAssignmentIdentifier(event)) return;
  assignTaskToVolunteerStore.fetchAssignmentDetails(event.identifier);
  emit("open-assignment-details");
};
</script>

<style lang="scss" scoped>
.task-orga-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  &__calendar {
    width: 100%;
  }
}
</style>
