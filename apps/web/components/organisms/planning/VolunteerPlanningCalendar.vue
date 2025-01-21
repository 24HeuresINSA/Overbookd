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
    <v-card
      max-width="400"
      prepend-icon="mdi-information-outline"
      text="Your application will relaunch automatically after the update is complete."
      :title="`FT n°` + ft_infos"
    >
      <template #actions>
        <v-btn class="ms-auto" text="Ok" @click="dialog = false" />
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { PlanningEvent } from "@overbookd/assignment";
import type { AssignmentStat, PlanningTask } from "@overbookd/http";
import { AFFECT_VOLUNTEER /*READ_FT*/ } from "@overbookd/permission";
import type { IProvidePeriod } from "@overbookd/time";
import type { User } from "@overbookd/user";
import { convertToCalendarBreak } from "~/domain/common/planning-events";
import { getColorByStatus } from "~/domain/common/status-color";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

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
// const canReadFT = computed<boolean>(() => userStore.can(READ_FT));

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
      //link: canReadFT.value ? `${FT_URL}/${task.id}` : undefined,
      ft_id: `${task.id}`,
    }),
  );
  const taskEvents = tasks.value.map(
    ({ name, id, status, timeWindow: { start, end } }) =>
      createCalendarEvent({
        start,
        end,
        name: `[${id}] ${name}`,
        color: getColorByStatus(status),
        //link: canReadFT.value ? `${FT_URL}/${id}` : undefined,
        ft_id: `${id}`,
      }),
  );
  const breakEvents = breakPeriods.value.map(convertToCalendarBreak);
  return [...assignmentEvents, ...taskEvents, ...breakEvents];
});

const dialog = ref(false);
const ft_infos = ref("");

const openFtModal = (event: CalendarEvent) => {
  dialog.value = true;
  if (event.ft_id) ft_infos.value = event.ft_id;
};
</script>
