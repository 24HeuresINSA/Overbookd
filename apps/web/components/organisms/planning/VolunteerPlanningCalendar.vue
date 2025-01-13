<template>
  <OverCalendar :events="events" />
</template>

<script lang="ts" setup>
import type { PlanningEvent } from "@overbookd/assignment";
import type { PlanningTask } from "@overbookd/http";
import { AFFECT_VOLUNTEER, READ_FT } from "@overbookd/permission";
import type { IProvidePeriod } from "@overbookd/time";
import type { User } from "@overbookd/user";
import { FT_URL } from "@overbookd/web-page";
import { convertToCalendarBreak } from "~/domain/common/planning-events";
import { getColorByStatus } from "~/domain/common/status-color";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

const userStore = useUserStore();
const layoutStore = useLayoutStore();

const props = defineProps({
  volunteer: {
    type: Object as () => User,
    required: true,
  },
});

const canAssignVolunteer = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
const shouldShowStats = computed<boolean>(
  () => canAssignVolunteer.value && layoutStore.isDesktop,
);
const canReadFT = computed<boolean>(() => userStore.can(READ_FT));

onMounted(() => {
  userStore.getVolunteerAssignments(props.volunteer.id);
  userStore.getVolunteerAssignmentStats(props.volunteer.id);
  if (canAssignVolunteer.value) {
    userStore.getVolunteerBreakPeriods(props.volunteer.id);
  }
  if (shouldShowStats.value) {
    userStore.getVolunteerAssignmentStats(props.volunteer.id);
  }
});

const assignments = computed<PlanningEvent[]>(
  () => userStore.selectedUserAssignments,
);
const tasks = computed<PlanningTask[]>(() => userStore.selectedUserTasks);
const breakPeriods = computed<IProvidePeriod[]>(
  () => userStore.selectedUserBreakPeriods,
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
