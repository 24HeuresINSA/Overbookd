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

  <v-dialog
    v-if="selectedTask"
    v-model="isTaskDetailsDialogOpen"
    max-width="900"
  >
    <DialogCard without-actions @close="isTaskDetailsDialogOpen = false">
      <template #title>
        [{{ selectedTask.id }}] {{ selectedTask.name }}
        <v-icon
          v-if="canReadFT"
          icon="mdi-open-in-new"
          size="x-small"
          @click="openAssignmentInNewTab"
        />
      </template>
      <template #content>
        <div class="assignment-details__content">
          <div class="assignment-metadata">
            <v-chip
              color="primary"
              variant="elevated"
              class="assignment-metadata__chip"
            >
              <v-icon icon="mdi-map-marker" />
              <span>{{
                selectedTask.appointment
                  ? selectedTask.appointment.name
                  : "Aucun lieu assigné"
              }}</span>
            </v-chip>
            <v-chip
              color="primary"
              variant="elevated"
              class="assignment-metadata__chip"
            >
              <v-icon icon="mdi-clock" />
              <span>
                {{ formatTimeWindowForCalendar(selectedTask.timeWindow) }}
              </span>
            </v-chip>
          </div>
        </div>
        <div class="contacts">
          <h3>
            Orga{{ selectedTask.contacts.length > 1 ? "s" : "" }} à contacter
          </h3>
          <ul>
            <li v-for="contact in selectedTask.contacts" :key="contact.phone">
              {{ buildUserNameWithNickname(contact) }} -
              {{ formatUserPhone(contact.phone) }}
            </li>
          </ul>
        </div>
        <div class="contacts">
          <h3>Bénévoles affectés sur le créneau</h3>
          <ul>
            <li v-for="user in selectedTask.assignees" :key="user.id">
              {{ buildUserNameWithNickname(user) }}
            </li>
          </ul>
        </div>
        <div class="instructions">
          <h3>Instructions</h3>
          <div
            v-html-safe="selectedTask.globalInstruction"
            class="instructions__text"
          />
        </div>
        <div v-if="selectedTask.inChargeInstruction" class="instructions">
          <h3>Instructions pour les responsables</h3>
          <div
            v-html-safe="selectedTask.inChargeInstruction"
            class="instructions__text"
          />
        </div>
      </template>
    </DialogCard>
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
import type { TimeWindow } from "@overbookd/festival-event";
import type {
  AssignmentStat,
  PlanningTask,
  TaskForCalendar,
} from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import { Period, type IProvidePeriod } from "@overbookd/time";
import { FT_URL } from "@overbookd/web-page";
import {
  convertToCalendarBreak,
  type BreakEvent,
} from "~/domain/common/break-events";
import { formatUserPhone } from "~/utils/user/user.utils";
import { formatDateToHumanReadable } from "@overbookd/time";
import { buildUserNameWithNickname } from "@overbookd/user";
import type { BreakDefinition } from "@overbookd/planning";
import {
  toCalendarAssignment,
  buildToCalendarTask,
  type CalendarEventForPlanning,
} from "~/utils/planning/event";
import { openPageWithIdInNewTab } from "~/utils/navigation/router.utils";

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

const isTaskDetailsDialogOpen = ref<boolean>(false);

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

const openAssignmentInNewTab = () => {
  if (!selectedTask.value) return;
  openPageWithIdInNewTab(FT_URL, selectedTask.value.id);
};

const formatTimeWindowForCalendar = ({ start, end }: TimeWindow) => {
  return `${formatDateToHumanReadable(start)} - ${formatDateToHumanReadable(end)}`;
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

<style lang="scss" scoped>
.assignment-metadata {
  display: flex;
  gap: 15px;
  &__chip {
    .v-icon {
      margin-right: 5px;
    }
  }
}

.assignment-details {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
      margin-bottom: 5px;
    }
    .friend-list {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin: 4px 0;
    }
  }
}

.assignees {
  &__assignee-team {
    margin-left: 4px;
  }
  &__actions {
    display: flex;
    gap: 5px;
  }
}

.volunteer-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.instructions {
  padding-top: 2rem;

  &__text {
    margin-left: 1rem;
  }
  :deep(h1) {
    font-size: x-large;
  }
  :deep(h2) {
    font-size: large;
  }
  :deep(ul),
  :deep(ol) {
    padding-left: 2rem;
  }
}

.contacts {
  padding-top: 2rem;
}

.contacts > ul {
  padding-left: 2rem;
}
</style>
