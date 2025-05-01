<template>
  <div class="orga-task-calendar">
    <div v-show="selectedVolunteer" class="title">
      <h1 class="title__name">{{ volunteerName }}</h1>
      <AssignmentVolunteerStats :stats="stats" class="title__stats" />
    </div>
    <OverCalendar
      v-model="calendarMarker"
      :events="events"
      :availabilities="availabilities"
      clickable-events
      :can-use-calendar-shortcuts="props.canUseCalendarShortcuts"
      @click:event="selectAssignmentToDisplayDetails"
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
import { convertToCalendarBreak } from "~/domain/common/break-events";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { CalendarEventWithIdentifier } from "~/utils/assignment/calendar-event";
import { FT_URL } from "@overbookd/web-page";

const userStore = useUserStore();
const configurationStore = useConfigurationStore();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const availabilitiesStore = useVolunteerAvailabilityStore();

const props = defineProps({
  canUseCalendarShortcuts: {
    type: Boolean,
    default: true,
  },
});

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
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

const stats = computed<AssignmentStat[]>(
  () => userStore.selectedUserAssignmentStats,
);

const availabilities = computed<IProvidePeriod[]>(
  () => availabilitiesStore.availabilities.list,
);

const emit = defineEmits(["display-assignment-details"]);
const selectAssignmentToDisplayDetails = (
  event: CalendarEventWithIdentifier | CalendarEvent,
) => {
  if (!("identifier" in event)) return;
  assignVolunteerToTaskStore.fetchAssignmentDetails(event.identifier);
  emit("display-assignment-details");
};

const formatAssignmentForCalendar = (
  assignment: DisplayableAssignment,
  color?: string,
): CalendarEventWithIdentifier => {
  return createCalendarEvent({
    start: assignment.start,
    end: assignment.end,
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
    link: `${FT_URL}/${id}`,
  });
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 4px;
  margin-bottom: 8px;
  &__name {
    font-size: 1.4rem;
    font-weight: 500;
  }
  &__stats {
    margin-top: 2px;
  }
}
</style>
