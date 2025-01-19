<template>
  <div class="orga-task-calendar">
    <div v-show="selectedVolunteer" class="title">
      <h1 class="title__name">{{ volunteerName }}</h1>
      <span>|</span>
      <AssignmentVolunteerStats :stats="stats" class="title__stats" />
    </div>
    <OverCalendar
      v-model="calendarMarker"
      :events="events"
      :availabilities="availabilities"
    />
  </div>
</template>

<script lang="ts" setup>
import type { IProvidePeriod } from "@overbookd/time";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import type {
  AssignmentStat,
  AssignmentSummaryWithTask,
  DisplayableAssignment,
  PlanningTask,
} from "@overbookd/http";
import { PURPLE, getColorByStatus } from "~/domain/common/status-color";
import { convertToCalendarBreak } from "~/domain/common/planning-events";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { CalendarEventWithIdentifier } from "~/utils/assignment/calendar-event";

const userStore = useUserStore();
const configurationStore = useConfigurationStore();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const availabilitiesStore = useVolunteerAvailabilityStore();

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
watch(selectedVolunteer, async (volunteer) => {
  if (volunteer) await refreshVolunteerData(volunteer.id);
});

const volunteerName = computed<string>(() =>
  selectedVolunteer.value
    ? buildUserNameWithNickname(selectedVolunteer.value)
    : "",
);

const calendarMarker = ref<Date>(new Date());
const eventStartDate = computed<Date>(() => configurationStore.eventStartDate);
onMounted(() => (calendarMarker.value = eventStartDate.value));

const hoverAssignment = computed<AssignmentSummaryWithTask | null>(
  () => assignVolunteerToTaskStore.hoverAssignment,
);
watch(hoverAssignment, () => {
  if (hoverAssignment.value) calendarMarker.value = hoverAssignment.value.start;
});

const alreadyAssignedAssignments = computed<DisplayableAssignment[]>(
  () => assignVolunteerToTaskStore.alreadyAssignedAssignments,
);
const notReadyTasks = computed<PlanningTask[]>(
  () => userStore.selectedUserTasks,
);
const breaks = computed<IProvidePeriod[]>(
  () => assignVolunteerToTaskStore.breakPeriods,
);
const events = computed<CalendarEvent[]>(() => {
  const tasks = notReadyTasks.value.map((task) => formatTaskForCalendar(task));
  const alreadyAssigned = [...alreadyAssignedAssignments.value].map(
    (assignment) => formatAssignmentForCalendar(assignment, PURPLE),
  );
  const hoverAssignments = hoverAssignment.value
    ? [formatAssignmentForCalendar(hoverAssignment.value)]
    : [];
  const calendarBreaks = breaks.value.map(convertToCalendarBreak);
  return [...tasks, ...alreadyAssigned, ...hoverAssignments, ...calendarBreaks];
});

// const hourToScrollTo = computed<number | undefined>(() =>
//   hoverAssignment.value?.start.getHours(),
// );

const stats = computed<AssignmentStat[]>(
  () => userStore.selectedUserAssignmentStats,
);

const refreshVolunteerData = async (volunteerId: number) => {
  await Promise.all([
    availabilitiesStore.fetchVolunteerAvailabilities(volunteerId),
    userStore.getVolunteerAssignments(volunteerId),
    userStore.getVolunteerAssignmentStats(volunteerId),
    assignVolunteerToTaskStore.fetchAllAssignmentsFor(volunteerId),
    assignVolunteerToTaskStore.fetchBreakPeriodsFor(volunteerId),
    userStore.getVolunteerTasks(volunteerId),
  ]);
};

const availabilities = computed<IProvidePeriod[]>(
  () => availabilitiesStore.availabilities.list,
);

// const emit = defineEmits(["display-assignment-details"]);
// const selectAssignmentToDisplayDetails = (
//   event: DisplayableAssignment | CalendarEvent,
// ) => {
//   if ("taskId" in event) {
//     assignVolunteerToTaskStore.fetchAssignmentDetails(event);
//     emit("display-assignment-details");
//   }
// };

// const openFtInNewTab = (event: DisplayableAssignment | CalendarEvent) => {
//   if ("taskId" in event) return;
//   window.open(event.link);
// };

const formatAssignmentForCalendar = (
  assignment: DisplayableAssignment,
  color?: string,
): CalendarEventWithIdentifier => {
  return createCalendarEvent({
    ...assignment,
    color,
    name: `[${assignment.taskId}] ${assignment.name}`,
    identifier: {
      assignmentId: assignment.assignmentId,
      mobilizationId: assignment.mobilizationId,
      taskId: assignment.taskId,
    },
  });
};
const formatTaskForCalendar = ({
  name,
  id,
  status,
  timeWindow: { start, end },
}: PlanningTask): CalendarEvent => {
  return createCalendarEvent({
    start,
    end,
    name: `[${id}] ${name}`,
    color: getColorByStatus(status),
  });
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  &__name {
    font-size: 1.4rem;
    font-weight: 500;
    margin-right: 8px;
  }
  &__stats {
    margin-top: 2px;
    margin-left: 8px;
  }
}
</style>
