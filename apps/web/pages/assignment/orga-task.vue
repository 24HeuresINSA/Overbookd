<template>
  <div class="assignment">
    <FilterableVolunteerList v-model:filters="filters" @select-volunteer="selectVolunteer" />
    <OrgaTaskCalendar
      class="calendar"
      :can-use-calendar-shortcuts="canUseCalendarShortcuts"
      @display-volunteer-details="openVolunteerInfoDialog"
      @display-assignment-details="openAssignmentDetailsDialog"
      @ask-for-break="askForBreak"
      @remove-break="openBreakRemoval"
    />
    <FilterableTaskAssignmentList @volunteer-assigned="refreshVolunteerData" />

    <v-dialog v-model="isVolunteerInfoDialogOpen" width="1400px">
      <VolunteerInformationDialogCard
        v-if="selectedUser"
        :volunteer="selectedUser"
        @updated="onUpdateSelectedVolunteer"
        @update-teams="onUpdateSelectedVolunteerTeams"
        @update-friends="onUpdateSelectedVolunteerFriends"
        @update-availabilities="onUpdateSelectedVolunteerAvailabilities"
        @close="closeVolunteerInfoDialog"
      />
    </v-dialog>

    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <AssignmentDetailsDialogCard
        v-if="assignmentDetails"
        :assignment-details="assignmentDetails"
        :highlighted-assignee-id="selectedVolunteer?.id"
        @close="closeAssignmentDetailsDialog"
        @unassign="unassignVolunteer"
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
  </div>
</template>

<script lang="ts" setup>
import type {
  AssignmentWithDetails,
  BreakDefinition,
  BreakPeriod,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import { buildUserName } from "@overbookd/user";
import type { Period } from "@overbookd/time";
import type { UnassignForm } from "~/utils/assignment/assignment";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import type { BreakEvent } from "~/domain/common/break-events";
import { OrgaTaskFilterBuilder, type OrgaTaskFilters } from "~/utils/assignment/filters/orga-task.filter";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { SELECTED_VOLUNTEER_QUERY_PARAM } from "~/utils/assignment/filters/assignment-filters.constant";

const DEFAULT_TITLE = "Affect Orga-Tâche";
useHead({ title: DEFAULT_TITLE });

const route = useRoute();
const userStore = useUserStore();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const availabilitiesStore = useVolunteerAvailabilityStore();
const planningStore = usePlanningStore();

const selectedUser = computed<UserDataWithPotentialyProfilePicture | undefined>(
  () => userStore.selectedUser,
);

const assignmentDetails = computed<AssignmentWithDetails | null>(
  () => assignVolunteerToTaskStore.assignmentDetails,
);

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
const title = computed<string>(() => {
  if (!selectedVolunteer.value) return DEFAULT_TITLE;
  return `${buildUserName(selectedVolunteer.value)} affect`;
});
watch(title, (newTitle) => (document.title = newTitle));

const selectVolunteer = (volunteer: VolunteerWithAssignmentDuration) => {
  assignVolunteerToTaskStore.selectVolunteer(volunteer);
  updateQueryParams(SELECTED_VOLUNTEER_QUERY_PARAM, volunteer.id);
  refreshVolunteerData(volunteer.id);
};
const unassignVolunteer = async (form: UnassignForm) => {
  await assignVolunteerToTaskStore.unassign(form);
  refreshVolunteerData(form.assigneeId, true);
};

const refreshVolunteerData = async (
  volunteerId: number,
  isUnassign?: boolean,
) => {
  const isNotSelectedVolunteer = volunteerId !== selectedVolunteer.value?.id;
  if (isNotSelectedVolunteer) return;

  const otherFetch = isUnassign
    ? []
    : [
        availabilitiesStore.fetchVolunteerAvailabilities(volunteerId),
        planningStore.fetchVolunteerBreakPeriods(volunteerId),
        planningStore.fetchVolunteerTasks(volunteerId),
      ];

  await Promise.all([
    planningStore.fetchVolunteerAssignments(volunteerId),
    planningStore.fetchVolunteerAssignmentStats(volunteerId),
    assignVolunteerToTaskStore.fetchAllAssignmentsFor(volunteerId),
    ...otherFetch,
  ]);
};

const filters = ref<OrgaTaskFilters>({});
const updateFilters = () => {
  filters.value = OrgaTaskFilterBuilder.getFromRouteQuery(route.query);
  if (filters.value.selectedVolunteer) {
    refreshVolunteerData(filters.value.selectedVolunteer);
  }
};
watch(() => route.query, updateFilters);

onMounted(async () => {
  await assignVolunteerToTaskStore.fetchVolunteers();

  updateFilters();
  const volunteerId = filters.value.selectedVolunteer;
  if (!volunteerId) {
    planningStore.clearSelectedVolunteer();
    return;
  }
  const volunteer = assignVolunteerToTaskStore.volunteers.get(volunteerId);
  if (volunteer) selectVolunteer(volunteer);
});

const canUseCalendarShortcuts = computed<boolean>(() => {
  return (
    !isVolunteerInfoDialogOpen.value &&
    !displayAssignmentDetailsDialog.value &&
    !isBreakCreationDialogOpen.value &&
    !isBreakRemovalDialogOpen.value
  );
});

const isVolunteerInfoDialogOpen = ref<boolean>(false);
const openVolunteerInfoDialog = async () => {
  if (!selectedVolunteer.value) return;
  await userStore.findUserById(selectedVolunteer.value.id);
  isVolunteerInfoDialogOpen.value = true;
};
const onUpdateSelectedVolunteer = () => {
  assignVolunteerToTaskStore.fetchVolunteers();
  closeVolunteerInfoDialog();
};
const onUpdateSelectedVolunteerTeams = () => {
  assignVolunteerToTaskStore.fetchVolunteers();
  if (!selectedVolunteer.value) return;
  assignVolunteerToTaskStore.fetchPotentialAssignmentsFor(
    selectedVolunteer.value.id,
  );
};
const onUpdateSelectedVolunteerFriends = () => {
  assignVolunteerToTaskStore.fetchVolunteers();
  const selectedVolunteerId = selectedVolunteer.value?.id;
  if (!selectedVolunteerId) return;
  assignVolunteerToTaskStore.fetchFriendsFor(selectedVolunteerId);
  planningStore.fetchVolunteerAssignmentStats(selectedVolunteerId);
};
const onUpdateSelectedVolunteerAvailabilities = () => {
  if (!selectedVolunteer.value) return;
  assignVolunteerToTaskStore.fetchPotentialAssignmentsFor(
    selectedVolunteer.value.id,
  );
};
const closeVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = false;
};

const displayAssignmentDetailsDialog = ref<boolean>(false);
const openAssignmentDetailsDialog = () => {
  displayAssignmentDetailsDialog.value = true;
};
const closeAssignmentDetailsDialog = () => {
  displayAssignmentDetailsDialog.value = false;
};

const isBreakCreationDialogOpen = ref<boolean>(false);
const breakPeriodStart = ref<Date>(new Date());
const askForBreak = (period: Period) => {
  if (!selectedVolunteer.value) return;
  breakPeriodStart.value = period.start;
  isBreakCreationDialogOpen.value = true;
};
const closeBreakDialog = () => {
  isBreakCreationDialogOpen.value = false;
};
const saveBreak = (breakPeriod: Omit<BreakDefinition, "volunteer">) => {
  closeBreakDialog();
  if (!selectedVolunteer.value) return;
  planningStore.addVolunteerBreakPeriods({
    ...breakPeriod,
    volunteer: selectedVolunteer.value.id,
  });
};

const selectedBreak = ref<BreakPeriod | null>(null);
const isBreakRemovalDialogOpen = ref<boolean>(false);
const openBreakRemoval = (breakEvent: BreakEvent) => {
  if (!selectedVolunteer.value) return;
  selectedBreak.value = breakEvent;
  isBreakRemovalDialogOpen.value = true;
};
const closeBreakRemovalDialog = () => {
  selectedBreak.value = null;
  isBreakRemovalDialogOpen.value = false;
};
const removeBreak = async () => {
  if (selectedBreak.value === null || !selectedVolunteer.value) return;
  const period = selectedBreak.value;
  const volunteer = selectedVolunteer.value.id;
  await planningStore.deleteVolunteerBreakPeriods({ volunteer, period });
  isBreakRemovalDialogOpen.value = false;
};
</script>

<style lang="scss" scoped>
$layout-padding: 15px;

.assignment {
  display: flex;
  height: calc(100vh - $header-height - $layout-padding * 2 - 1px);
}

.calendar {
  flex-grow: 10;
  overflow-y: scroll;
}
</style>
