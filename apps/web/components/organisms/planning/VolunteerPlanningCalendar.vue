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
      @click:event="openFtModal"
    />
  </div>

  <v-dialog v-model="dialog" width="auto">
    <!-- max-width="400" -->
    <v-card
      prepend-icon="mdi-information-outline"
      :text="
        selectedTask.instructions.global
          ? selectedTask.instructions.global
          : 'Oops, pas de description'
      "
      :title="selectedTask.general.name"
    >
      <!-- On aurait envie d'utiliser v-html mais c'est vachement vulnérable alors on va implémenter sa propre solution -->

      <template #actions>
        <v-btn
          v-if="canReadFT.valueOf()"
          @click="navigateTo(`${FT_URL}/${selectedTask.id}`)"
        >
          <v-icon icon="mdi-pencil" />
          <v-tooltip activator="parent" location="top" open-delay="750">
            Editer FT
          </v-tooltip>
        </v-btn>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { PlanningEvent } from "@overbookd/assignment";
import type { AssignmentStat, PlanningTask } from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import { FT_URL } from "@overbookd/web-page";
import type { IProvidePeriod } from "@overbookd/time";
import type { User } from "@overbookd/user";
import { convertToCalendarBreak } from "~/domain/common/planning-events";
import { getColorByStatus } from "~/domain/common/status-color";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";
import { type FestivalTask } from "@overbookd/festival-event";

const userStore = useUserStore();
const layoutStore = useLayoutStore();
const configurationStore = useConfigurationStore();
const availabilityStore = useVolunteerAvailabilityStore();

type Volunteer = User & { teams: string[] };

const props = defineProps({
  volunteer: {
    type: Object as () => Volunteer,
    required: true,
  },
});

const canAssignVolunteer = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
const isDesktop = computed<boolean>(() => layoutStore.isDesktop);
const shouldShowStats = computed<boolean>(
  () => canAssignVolunteer.value && isDesktop.value,
);

const canReadFT = computed<boolean>(() => userStore.can(READ_FT));

onMounted(() => {
  availabilityStore.fetchVolunteerAvailabilities(props.volunteer.id);
  userStore.getVolunteerTasks(props.volunteer.id);
  userStore.getVolunteerAssignments(props.volunteer.id);
  if (canAssignVolunteer.value) {
    userStore.getVolunteerBreakPeriods(props.volunteer.id);
  }
  if (shouldShowStats.value) {
    userStore.getVolunteerAssignmentStats(props.volunteer.id);
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

const events = computed<CalendarEvent[]>(() => {
  const assignmentEvents = assignments.value.map(({ start, end, task }) =>
    createCalendarEvent({
      start,
      end,
      name: `[${task.id}] ${task.name}`,
      color: getColorByStatus(task.status),
      ft_id: task.id,
    }),
  );
  const taskEvents = tasks.value.map(
    ({ name, id, status, timeWindow: { start, end } }) =>
      createCalendarEvent({
        start,
        end,
        name: `[${id}] ${name}`,
        color: getColorByStatus(status),
        ft_id: id,
      }),
  );
  const breakEvents = breakPeriods.value.map(convertToCalendarBreak);
  return [...assignmentEvents, ...taskEvents, ...breakEvents];
});

// Aie aie, problème, on ne peut faire appel au ftStore qu'avec des perms hard
const planningStore = usePlanningStore();
const testFTstore = useFestivalTaskStore();
const selectedTask = computed<FestivalTask>(() => planningStore.ft_reader);

const dialog = ref<boolean>(false);

const openFtModal = async (event: CalendarEvent) => {
  if (event.ft_id) {
    await testFTstore.fetchTask(event.ft_id);
    await planningStore.getReadFtInfos(event.ft_id);
    dialog.value = true;
  }
};
</script>
