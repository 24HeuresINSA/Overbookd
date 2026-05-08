<template>
  <DesktopPageTitle />

  <div class="multi-planning">
    <MultiPlanningFilterCard
      v-model:volunteers="selectedVolunteers"
      :loading="loading"
      @apply="onApplyFilters"
    />

    <OverMultiCalendar
      v-model="day"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :volunteers="volunteersForCalendar"
      clickable-events
      @click:event="handleEventClicked"
    >
      <template #volunteer-header="{ volunteer }">
        <MultiPlanningVolunteerResumeCalendarHeader
          :volunteer="volunteer"
          class="volunteer-header"
        />
      </template>
    </OverMultiCalendar>
  </div>

  <v-dialog v-model="isTaskDetailsDialogOpen" max-width="900px">
    <TaskDetailsDialogCard
      v-if="selectedTask"
      :selected-task="selectedTask"
      @close="closeTaskDetailsDialog"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { AssignmentIdentifier } from "@overbookd/assignment";
import type { TaskForCalendar } from "@overbookd/http";
import { READ_FT } from "@overbookd/permission";
import { formatLocalDateTime } from "@overbookd/time";
import type { User } from "@overbookd/user";
import { toCalendarBreak } from "~/domain/common/break-events";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import {
  ASSIGNMENT,
  MOBILIZATION,
  toCalendarAssignment,
  toCalendarTask,
  type CalendarEventForPlanning,
} from "~/utils/planning/event";
import { MultiPlanningParamsBuilder } from "~/utils/planning/multi-planning.filter";

useHead({ title: "Multi Planning" });

const DEFAULT_PAGE = 0;
const DEFAULT_ITEMS_PER_PAGE = 10;

const userStore = useUserStore();
const planningStore = usePlanningStore();
const configurationStore = useConfigurationStore();

const selectedVolunteers = ref<User[]>([]);

const canReadFt = computed<boolean>(() => userStore.can(READ_FT));

const volunteersForCalendar = computed<VolunteerForCalendar[]>(() =>
  planningStore.multiPlanningVolunteers.map((volunteer) => {
    const tasks = volunteer.tasks.map((task) =>
      toCalendarTask({ canReadFt: canReadFt.value })(task),
    );
    const assignments = volunteer.assignments.map(toCalendarAssignment);
    const breaks = volunteer.breaks?.map(toCalendarBreak) ?? [];
    return {
      ...volunteer,
      events: [...tasks, ...assignments, ...breaks],
    };
  }),
);

const selectedTask = computed<TaskForCalendar | undefined>(
  () => planningStore.selectedCalendarTask,
);

const loading = ref<boolean>(false);

const onApplyFilters = async () => {
  loading.value = true;
  const volunteerIds = selectedVolunteers.value.map(({ id }) => id);
  await Promise.all([
    planningStore.getVolunteersForMultiPlanning(volunteerIds),
    updateQueryParams("volunteerIds", volunteerIds.map(String)),
  ]);
  loading.value = false;
};

const defaultDay = computed<Date>(() => configurationStore.eventStartDate);

const day = ref<Date>(defaultDay.value);
const page = ref<number>(DEFAULT_PAGE);
const itemsPerPage = ref<number>(DEFAULT_ITEMS_PER_PAGE);

const route = useRoute();
onMounted(async () => {
  await userStore.fetchVolunteers();
  const params = MultiPlanningParamsBuilder.getFromRouteQuery(route.query);
  if (params.volunteers) {
    selectedVolunteers.value = params.volunteers;
    onApplyFilters();
  }
  if (params.day) day.value = params.day;
  if (params.page) page.value = params.page;
  if (params.itemsPerPage) itemsPerPage.value = params.itemsPerPage;
});

watch(day, (d) =>
  updateQueryParams(
    "day",
    d.getTime() !== defaultDay.value.getTime()
      ? formatLocalDateTime(d)
      : undefined,
  ),
);
watch(page, (p) =>
  updateQueryParams("page", p !== DEFAULT_PAGE ? p : undefined),
);
watch(itemsPerPage, (ipp) =>
  updateQueryParams(
    "itemsPerPage",
    ipp !== DEFAULT_ITEMS_PER_PAGE ? ipp : undefined,
  ),
);

const isTaskDetailsDialogOpen = ref<boolean>(false);
const openAssignmentDetails = async (identifier: AssignmentIdentifier) => {
  await planningStore.fetchVolunteerAssignmentDetails(identifier);
  isTaskDetailsDialogOpen.value = true;
};
const closeTaskDetailsDialog = () => {
  isTaskDetailsDialogOpen.value = false;
};

const handleEventClicked = (event: CalendarEventForPlanning) => {
  switch (event.kind) {
    case MOBILIZATION:
      return console.debug("redirection is already handled by the calendar");
    case ASSIGNMENT:
      return openAssignmentDetails(event.identifier);
  }
};
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multi-planning {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}
</style>
