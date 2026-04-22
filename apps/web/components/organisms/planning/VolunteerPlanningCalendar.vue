<template>
  <div>
    <div class="actions">
      <DownloadPlanning />
      <v-btn
        v-if="canViewVolunteerDetails"
        text="Voir le profil"
        prepend-icon="mdi-account"
        color="primary"
        @click="openVolunteerInfoDialog"
      />
    </div>
    <AssignmentVolunteerStats
      v-if="shouldShowStats && stats"
      v-model:selected-category="selectedCategory"
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

  <v-dialog
    v-model="isVolunteerInfoDialogOpen"
    :width="canAssignVolunteer ? '1400px' : '700px'"
  >
    <VolunteerInformationDialogCard
      v-if="selectedVolunteer"
      :volunteer="selectedVolunteer"
      @updated="closeVolunteerInfoDialog"
      @close="closeVolunteerInfoDialog"
    />
  </v-dialog>

  <v-dialog v-model="isTaskDetailsDialogOpen" max-width="900px">
    <TaskDetailsDialogCard
      v-if="selectedTask"
      :selected-task="selectedTask"
      @close="closeTaskDetailsDialog"
    />
  </v-dialog>

  <v-dialog v-model="isBreakCreationDialogOpen" max-width="800px">
    <CreateBreakPeriodDialogCard
      :start="breakPeriodStart"
      @create="saveBreak"
      @close="closeBreakDialog"
    />
  </v-dialog>

  <v-dialog v-model="isBreakRemovalDialogOpen" max-width="800px">
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
  AssignmentIdentifier,
  BreakDefinition,
  BreakPeriod,
} from "@overbookd/assignment";
import type { AssignmentStats, TaskForCalendar } from "@overbookd/http";
import {
  AFFECT_VOLUNTEER,
  READ_FT,
  VIEW_VOLUNTEER_DETAILS,
} from "@overbookd/permission";
import { Period, type IProvidePeriod } from "@overbookd/time";
import { toCalendarBreak, type BreakEvent } from "~/domain/common/break-events";
import {
  shouldBeHighlighted,
  toCalendarAssignment,
  toCalendarTask,
  type CalendarEventForPlanning,
} from "~/utils/planning/event";
import type { VolunteerForPlanningCalendar } from "~/utils/planning/volunteer";
import type { SelectableCategory } from "~/utils/assignment/task-category";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

const userStore = useUserStore();
const planningStore = usePlanningStore();
const layoutStore = useLayoutStore();
const configurationStore = useConfigurationStore();
const availabilityStore = useVolunteerAvailabilityStore();

const { volunteerId } = defineProps({
  volunteerId: {
    type: Number,
    required: true,
  },
});

const selectedCategory = ref<SelectableCategory | undefined>(undefined);

const selectedVolunteer = computed<
  UserDataWithPotentialyProfilePicture | undefined
>(() => userStore.selectedUser);
const selectedTask = computed<TaskForCalendar | undefined>(
  () => planningStore.selectedCalendarTask,
);

const canViewVolunteerDetails = computed<boolean>(() =>
  userStore.can(VIEW_VOLUNTEER_DETAILS),
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
  availabilityStore.fetchVolunteerAvailabilities(volunteerId);
  planningStore.fetchVolunteerTasks(volunteerId);
  planningStore.fetchVolunteerAssignments(volunteerId);
  if (canViewVolunteerDetails) {
    userStore.findUserById(volunteerId);
  }
  if (canAssignVolunteer.value) {
    planningStore.fetchVolunteerBreakPeriods(volunteerId);
  }
  if (shouldShowStats.value) {
    planningStore.fetchVolunteerAssignmentStats(volunteerId);
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

const assignmentEvents = computed<CalendarEventForPlanning[]>(() =>
  selectedPlanningVolunteer.value.assignments.map((assignment) => {
    const event = toCalendarAssignment(assignment);
    const selected = shouldBeHighlighted(
      selectedCategory.value,
      assignment.task,
    );
    return { ...event, selected };
  }),
);
const taskEvents = computed<CalendarEventForPlanning[]>(() =>
  selectedPlanningVolunteer.value.tasks.map((task) =>
    toCalendarTask({ canReadFt: canReadFt.value })(task),
  ),
);
const breakEvents = computed<CalendarEventForPlanning[]>(() =>
  selectedPlanningVolunteer.value.breakPeriods.map(toCalendarBreak),
);
const events = computed<CalendarEventForPlanning[]>(() => [
  ...assignmentEvents.value,
  ...taskEvents.value,
  ...breakEvents.value,
]);

const canUseCalendarShortcuts = computed<boolean>(() => {
  return (
    !isVolunteerInfoDialogOpen.value &&
    !isTaskDetailsDialogOpen.value &&
    !isBreakCreationDialogOpen.value &&
    !isBreakRemovalDialogOpen.value
  );
});

const isVolunteerInfoDialogOpen = ref<boolean>(false);
const openVolunteerInfoDialog = () => {
  if (!canViewVolunteerDetails.value) return;
  isVolunteerInfoDialogOpen.value = true;
};
const closeVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = false;
};

const isTaskDetailsDialogOpen = ref<boolean>(false);
const openAssignmentDetails = async (identifier: AssignmentIdentifier) => {
  await planningStore.fetchVolunteerAssignmentDetails(identifier);
  isTaskDetailsDialogOpen.value = true;
};
const closeTaskDetailsDialog = () => {
  isTaskDetailsDialogOpen.value = false;
};

const isBreakCreationDialogOpen = ref<boolean>(false);
const breakPeriodStart = ref<Date>(new Date());
const askForBreak = (period: Period) => {
  if (!canAssignVolunteer.value) return;
  breakPeriodStart.value = period.start;
  isBreakCreationDialogOpen.value = true;
};
const closeBreakDialog = () => {
  isBreakCreationDialogOpen.value = false;
};
const saveBreak = (breakPeriod: Omit<BreakDefinition, "volunteer">) => {
  closeBreakDialog();
  planningStore.addVolunteerBreakPeriods({
    ...breakPeriod,
    volunteer: volunteerId,
  });
};

const selectedBreak = ref<BreakPeriod | null>(null);
const isBreakRemovalDialogOpen = ref<boolean>(false);
const openBreakRemoval = (breakEvent: BreakEvent) => {
  if (!canAssignVolunteer.value) return;
  selectedBreak.value = breakEvent;
  isBreakRemovalDialogOpen.value = true;
};
const closeBreakRemovalDialog = () => {
  selectedBreak.value = null;
  isBreakRemovalDialogOpen.value = false;
};
const removeBreak = async () => {
  if (selectedBreak.value === null) return;
  const period = selectedBreak.value;
  const volunteer = volunteerId;
  await planningStore.deleteVolunteerBreakPeriods({ volunteer, period });
  isBreakRemovalDialogOpen.value = false;
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
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    margin: 5px 3% 15px 3%;
  }
}
</style>
