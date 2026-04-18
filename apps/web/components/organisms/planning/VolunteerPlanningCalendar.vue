<template>
  <div>
    <DownloadPlanning />
    <AssignmentVolunteerStats
      v-if="stats"
      v-show="shouldShowStats"
      :stats="stats"
      class="mb-2"
    />
    <OverCalendar
      v-model="calendarMarker"
      :events="events"
      :availabilities="availabilities"
      clickable-events
      :can-use-calendar-shortcuts="canUseCalendarShortcuts"
      @click:event="handleEventClicked"
      @click:period="askForBreak"
    />
  </div>

  <v-dialog v-model="isTaskDetailsDialogOpen" max-width="900">
    <TaskDetailsDialogCard
      v-if="selectedTask"
      :selected-task="selectedTask"
      @close="closeTaskDetailsDialog"
    />
  </v-dialog>

  <v-dialog v-model="isBreakPeriodDialogOpen" max-width="900">
    <CreateBreakPeriodDialogCard
      :start="breakPeriodStart"
      @create="saveBreak"
      @close="closeBreakDialog"
    />
  </v-dialog>

  <v-dialog v-model="isBreakRemovalDialogOpen" max-width="900">
    <DeleteBreakPeriodFialogCard
      v-if="selectedBreak"
      :selected-break="selectedBreak"
      @close="closeBreakRemovalDialog"
      @confirm="removeBreak"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { AssignmentIdentifier } from "@overbookd/assignment";
import type { AssignmentStats, TaskForCalendar } from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import { Period, type IProvidePeriod } from "@overbookd/time";
import { toCalendarBreak, type BreakEvent } from "~/domain/common/break-events";
import type { BreakDefinition } from "@overbookd/planning";
import {
  toCalendarAssignment,
  toCalendarTask,
  type CalendarEventForPlanning,
} from "~/utils/planning/event";
import type { VolunteerForPlanningCalendar } from "~/utils/planning/volunteer";

const userStore = useUserStore();
const planningStore = usePlanningStore();
const layoutStore = useLayoutStore();
const configurationStore = useConfigurationStore();
const availabilityStore = useVolunteerAvailabilityStore();

const props = defineProps({
  volunteerId: {
    type: Number,
    required: true,
  },
});

const canUseCalendarShortcuts = computed<boolean>(() => {
  return (
    !isTaskDetailsDialogOpen.value &&
    !isBreakPeriodDialogOpen.value &&
    !isBreakRemovalDialogOpen.value
  );
});

const selectedTask = computed<TaskForCalendar | undefined>(
  () => planningStore.selectedCalendarTask,
);

const canAssignVolunteer = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
const canReadFt = computed<boolean>(() => userStore.can(READ_FT));
const isDesktop = computed<boolean>(() => layoutStore.isDesktop);
const shouldShowStats = computed<boolean>(
  () => canAssignVolunteer.value && isDesktop.value,
);

onMounted(() => {
  availabilityStore.fetchVolunteerAvailabilities(props.volunteerId);
  planningStore.fetchVolunteerTasks(props.volunteerId);
  planningStore.fetchVolunteerAssignments(props.volunteerId);
  if (canAssignVolunteer.value) {
    planningStore.fetchVolunteerBreakPeriods(props.volunteerId);
  }
  if (shouldShowStats.value) {
    planningStore.fetchVolunteerAssignmentStats(props.volunteerId);
  }
});

const calendarMarker = ref<Date>(configurationStore.eventStartDate);

const stats = computed<AssignmentStats | undefined>(
  () => planningStore.selectedVolunteer.assignmentStats,
);
const selectedPlanningVolunteer = computed<VolunteerForPlanningCalendar>(
  () => planningStore.selectedVolunteer as VolunteerForPlanningCalendar,
);
const availabilities = computed<IProvidePeriod[]>(
  () => availabilityStore.availabilities.list,
);

const events = computed<CalendarEventForPlanning[]>(() => {
  const { assignments, tasks, breakPeriods } = selectedPlanningVolunteer.value;
  const assignmentEvents = assignments.map(toCalendarAssignment);
  const taskEvents = tasks.map((task) =>
    toCalendarTask({ canReadFt: canReadFt.value })(task),
  );
  const breakEvents = breakPeriods.map(toCalendarBreak);
  return [...assignmentEvents, ...taskEvents, ...breakEvents];
});

const openAssignmentDetails = async (identifier: AssignmentIdentifier) => {
  await planningStore.fetchVolunteerAssignmentDetails(identifier);
  isTaskDetailsDialogOpen.value = true;
};

const CLICK_ON_EVENT: {
  [kind in CalendarEventForPlanning["kind"]]: (
    event: Extract<CalendarEventForPlanning, { kind: kind }>,
  ) => void | Promise<void>;
} = {
  mobilization: () => {
    console.debug("redirection is already handled by the calendar");
  },
  assignment: async (taskAssigned) => {
    openAssignmentDetails(taskAssigned.identifier);
  },
  break: (period) => {
    openBreakRemoval(period);
  },
};

const handleEventClicked = (event: CalendarEventForPlanning) => {
  switch (event.kind) {
    case "mobilization":
      return CLICK_ON_EVENT.mobilization(event);
    case "assignment":
      return CLICK_ON_EVENT.assignment(event);
    case "break":
      return CLICK_ON_EVENT.break(event);
  }
};

const isTaskDetailsDialogOpen = ref<boolean>(false);
const closeTaskDetailsDialog = () => {
  isTaskDetailsDialogOpen.value = false;
};

const isBreakPeriodDialogOpen = ref<boolean>(false);
const breakPeriodStart = ref<Date>(new Date());

const askForBreak = (period: Period) => {
  if (!canAssignVolunteer.value) return;
  breakPeriodStart.value = period.start;
  isBreakPeriodDialogOpen.value = true;
};
const closeBreakDialog = () => {
  isBreakPeriodDialogOpen.value = false;
};
const saveBreak = (during: BreakDefinition["during"]) => {
  closeBreakDialog();
  planningStore.addVolunteerBreakPeriods({
    during,
    volunteer: props.volunteerId,
  });
};

const selectedBreak = ref<Period | null>(null);
const isBreakRemovalDialogOpen = ref<boolean>(false);
const openBreakRemoval = (period: BreakEvent) => {
  if (!canAssignVolunteer.value) return;
  selectedBreak.value = Period.init(period);
  isBreakRemovalDialogOpen.value = true;
};
const closeBreakRemovalDialog = () => {
  selectedBreak.value = null;
  isBreakRemovalDialogOpen.value = false;
};
const removeBreak = async () => {
  if (selectedBreak.value === null) return;
  const period = selectedBreak.value;
  const volunteer = props.volunteerId;
  await planningStore.deleteVolunteerBreakPeriods({ volunteer, period });
  isBreakRemovalDialogOpen.value = false;
};
</script>
