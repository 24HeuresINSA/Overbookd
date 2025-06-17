<template>
  <div>
    <DownloadPlanning />
    <AssignmentVolunteerStats
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
import type {
  AssignmentEvent,
  AssignmentIdentifier,
} from "@overbookd/assignment";
import type {
  AssignmentStat,
  PlanningTask,
  TaskForCalendar,
} from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import { Period, type IProvidePeriod } from "@overbookd/time";
import {
  convertToCalendarBreak,
  type BreakEvent,
} from "~/domain/common/break-events";
import type { BreakDefinition } from "@overbookd/planning";
import {
  toCalendarAssignment,
  buildToCalendarTask,
  type CalendarEventForPlanning,
} from "~/utils/planning/event";

const userStore = useUserStore();
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
  () => userStore.currentTaskForCalendar,
);

const canAssignVolunteer = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
const isDesktop = computed<boolean>(() => layoutStore.isDesktop);
const shouldShowStats = computed<boolean>(
  () => canAssignVolunteer.value && isDesktop.value,
);

const canReadFT = computed<boolean>(() => userStore.can(READ_FT));

onMounted(() => {
  availabilityStore.fetchVolunteerAvailabilities(props.volunteerId);
  userStore.getVolunteerTasks(props.volunteerId);
  userStore.getVolunteerAssignments(props.volunteerId);
  if (canAssignVolunteer.value) {
    userStore.getVolunteerBreakPeriods(props.volunteerId);
  }
  if (shouldShowStats.value) {
    userStore.getVolunteerAssignmentStats(props.volunteerId);
  }
});

const calendarMarker = ref<Date>(configurationStore.eventStartDate);

const stats = computed<AssignmentStat[]>(
  () => userStore.selectedUserAssignmentStats,
);
const assignments = computed<AssignmentEvent[]>(
  () => userStore.selectedUserAssignments,
);
const tasks = computed<PlanningTask[]>(() => userStore.selectedUserTasks);
const breakPeriods = computed<IProvidePeriod[]>(
  () => userStore.selectedUserBreakPeriods,
);
const availabilities = computed<IProvidePeriod[]>(
  () => availabilityStore.availabilities.list,
);

const toCalendarTask = buildToCalendarTask({ canReadFt: canReadFT.value });

const events = computed<CalendarEventForPlanning[]>(() => {
  const assignmentEvents = assignments.value.map(toCalendarAssignment);
  const taskEvents = tasks.value.map(toCalendarTask);
  const breakEvents = breakPeriods.value.map(convertToCalendarBreak);
  return [...assignmentEvents, ...taskEvents, ...breakEvents];
});

const openAssignmentDetails = async (identifier: AssignmentIdentifier) => {
  await userStore.getVolunteerAssignmentDetails(identifier);
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
  userStore.addVolunteerBreakPeriods({ during, volunteer: props.volunteerId });
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
  await userStore.deleteVolunteerBreakPeriods({ volunteer, period });
  isBreakRemovalDialogOpen.value = false;
};
</script>
