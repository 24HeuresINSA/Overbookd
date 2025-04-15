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
      @click:event="openAssignmentDetails"
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
              {{ contact.firstname }}
              {{ contact.lastname }}
              <span v-if="contact.nickname">({{ contact.nickname }})</span>
              - {{ formatUserPhone(contact.phone) }}
            </li>
          </ul>
        </div>
        <div class="instructions">
          <h3>Instructions</h3>
          <div
            v-html-safe="selectedTask.globalInstructions"
            class="assignment__global-instructions"
          />
          <div v-if="selectedTask.inChargeInstructions">
            <br />
            <h3>Instructions pour les responsables</h3>
            <div
              v-html-safe="selectedTask.inChargeInstructions"
              class="assignment__in-charge-instructions"
            />
          </div>
        </div>
      </template>
    </DialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type {
  AssignmentIdentifier,
  PlanningEvent,
} from "@overbookd/assignment";
import type { TimeWindow } from "@overbookd/festival-event";
import type {
  AssignmentStat,
  PlanningTask,
  TaskForCalendar,
} from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import type { IProvidePeriod } from "@overbookd/time";
import { FT_URL } from "@overbookd/web-page";
import { convertToCalendarBreak } from "~/domain/common/break-events";
import { getColorByStatus } from "~/domain/common/status-color";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { formatUserPhone } from "~/utils/user/user.utils";
import { formatDateToHumanReadable } from "@overbookd/time";

const userStore = useUserStore();
const layoutStore = useLayoutStore();
const configurationStore = useConfigurationStore();
const availabilityStore = useVolunteerAvailabilityStore();

type CalendarEventWithTaskId = CalendarEvent & {
  taskId: number;
};
type CalendarEventWithAssignmentIdentifier = CalendarEvent & {
  identifier: AssignmentIdentifier;
};
type CalendarEventForPlanning =
  | CalendarEvent
  | CalendarEventWithTaskId
  | CalendarEventWithAssignmentIdentifier;

const props = defineProps({
  volunteerId: {
    type: Number,
    required: true,
  },
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
const assignments = computed<PlanningEvent[]>(
  () => userStore.selectedUserAssignments,
);
const tasks = computed<PlanningTask[]>(() => userStore.selectedUserTasks);
const breakPeriods = computed<IProvidePeriod[]>(
  () => userStore.selectedUserBreakPeriods,
);
const availabilities = computed<IProvidePeriod[]>(
  () => availabilityStore.availabilities.list,
);

const events = computed<CalendarEventForPlanning[]>(() => {
  const assignmentEvents = assignments.value.map(
    ({ start, end, task, assignmentId, mobilizationId }) => {
      const identifier =
        mobilizationId && assignmentId
          ? {
              taskId: task.id,
              assignmentId: assignmentId,
              mobilizationId: mobilizationId,
            }
          : undefined;
      return createCalendarEvent({
        start,
        end,
        name: `[${task.id}] ${task.name}`,
        color: getColorByStatus(task.status),
        identifier,
      });
    },
  );
  const taskEvents = tasks.value.map(
    ({ name, id, status, timeWindow: { start, end } }) =>
      createCalendarEvent({
        start,
        end,
        name: `[${id}] ${name}`,
        color: getColorByStatus(status),
      }),
  );
  const breakEvents = breakPeriods.value.map(convertToCalendarBreak);
  return [...assignmentEvents, ...taskEvents, ...breakEvents];
});

const isTaskDetailsDialogOpen = ref<boolean>(false);

const openAssignmentDetails = async (event: CalendarEventForPlanning) => {
  if (!("identifier" in event)) return;
  await userStore.getVolunteerAssignmentDetails(event.identifier);
  isTaskDetailsDialogOpen.value = true;
};

const openAssignmentInNewTab = () => {
  if (!selectedTask.value) return;
  navigateTo(`${FT_URL}/${selectedTask.value.id}`);
};

const formatTimeWindowForCalendar = ({ start, end }: TimeWindow) => {
  return `${formatDateToHumanReadable(start)} - ${formatDateToHumanReadable(end)}`;
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

  .assignment {
    &__global-instructions,
    &__in-charge-instructions {
      margin-left: 1rem;
    }
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
