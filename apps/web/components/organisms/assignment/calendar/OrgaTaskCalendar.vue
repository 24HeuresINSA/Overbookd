<template>
  <div class="orga-task-calendar">
    <div v-show="selectedVolunteer" class="title">
      <h1 class="title__name">{{ volunteerName }}</h1>
      <AssignmentVolunteerStats
        v-if="stats"
        v-model:selected-category="selectedCategory"
        :stats="stats"
        class="title__stats"
      />
    </div>
    <OverCalendar
      v-model="calendarMarker"
      :events="events"
      :availabilities="availabilities"
      clickable-events
      :can-use-calendar-shortcuts="canUseCalendarShortcuts"
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
import type {
  AssignmentEvent,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import type { AssignmentStats, PlanningTask } from "@overbookd/http";
import { PURPLE, getColorByStatus } from "~/domain/common/status-color";
import { toCalendarBreak } from "~/domain/common/break-events";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { CalendarEventWithIdentifier } from "~/utils/assignment/calendar-event";
import { FT_URL } from "@overbookd/web-page";
import type { SelectableCategory } from "~/utils/assignment/task-category";
import { shouldBeHighlighted } from "~/utils/planning/event";

const planningStore = usePlanningStore();
const configurationStore = useConfigurationStore();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const availabilitiesStore = useVolunteerAvailabilityStore();

defineProps({
  canUseCalendarShortcuts: {
    type: Boolean,
    default: true,
  },
});

const selectedCategory = ref<SelectableCategory | undefined>(undefined);

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

const hoverAssignment = computed<AssignmentEvent | null>(
  () => assignVolunteerToTaskStore.hoverAssignment,
);
watch(hoverAssignment, () => {
  if (hoverAssignment.value) calendarMarker.value = hoverAssignment.value.start;
});

const alreadyAssignedEvents = computed<CalendarEvent[]>(() =>
  assignVolunteerToTaskStore.alreadyAssignedAssignments.map((assignment) => {
    const event = formatAssignmentForCalendar(assignment, PURPLE);
    const selected = shouldBeHighlighted(
      selectedCategory.value,
      assignment.task,
    );
    return { ...event, selected };
  }),
);
const hoverAssignmentsEvents = computed<CalendarEvent[]>(() => {
  const assignment = hoverAssignment.value;
  if (!assignment) return [];
  const event = formatAssignmentForCalendar(assignment);
  const selected = shouldBeHighlighted(selectedCategory.value, assignment.task);
  return [{ ...event, selected }];
});
const taskEvents = computed<CalendarEvent[]>(() =>
  planningStore.selectedVolunteer.tasks.map(formatTaskForCalendar),
);
const breakEvents = computed<CalendarEvent[]>(() =>
  assignVolunteerToTaskStore.breakPeriods.map(toCalendarBreak),
);
const events = computed<CalendarEvent[]>(() => [
  ...taskEvents.value,
  ...alreadyAssignedEvents.value,
  ...hoverAssignmentsEvents.value,
  ...breakEvents.value,
]);

const stats = computed<AssignmentStats | undefined>(
  () => planningStore.selectedVolunteer.assignmentStats,
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
  assignment: AssignmentEvent,
  color?: string,
): CalendarEventWithIdentifier => {
  return createCalendarEvent({
    start: assignment.start,
    end: assignment.end,
    color,
    name: `[${assignment.task.id}] ${assignment.task.name}`,
    identifier: {
      assignmentId: assignment.assignmentId,
      mobilizationId: assignment.mobilizationId,
      taskId: assignment.task.id,
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
