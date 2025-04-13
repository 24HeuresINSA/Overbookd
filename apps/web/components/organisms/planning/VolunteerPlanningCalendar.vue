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
    />
  </div>
</template>

<script lang="ts" setup>
import type { PlanningEvent } from "@overbookd/assignment";
import type { AssignmentStat, PlanningTask } from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import type { IProvidePeriod } from "@overbookd/time";
import { FT_URL } from "@overbookd/web-page";
import { convertToCalendarBreak } from "~/domain/common/break-events";
import { getColorByStatus } from "~/domain/common/status-color";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

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

const events = computed<CalendarEvent[]>(() => {
  const assignmentEvents = assignments.value.map(({ start, end, task }) =>
    createCalendarEvent({
      start,
      end,
      name: `[${task.id}] ${task.name}`,
      color: getColorByStatus(task.status),
      link: canReadFT.value ? `${FT_URL}/${task.id}` : undefined,
    }),
  );
  const taskEvents = tasks.value.map(
    ({ name, id, status, timeWindow: { start, end } }) =>
      createCalendarEvent({
        start,
        end,
        name: `[${id}] ${name}`,
        color: getColorByStatus(status),
        link: canReadFT.value ? `${FT_URL}/${id}` : undefined,
      }),
  );
  const breakEvents = breakPeriods.value.map(convertToCalendarBreak);
  return [...assignmentEvents, ...taskEvents, ...breakEvents];
});
</script>
