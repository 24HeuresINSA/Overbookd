<template>
  <div class="assignment">
    <FilterableVolunteerList
      class="volunteer-list"
      @select-volunteer="selectVolunteer"
    />
    <OrgaTaskCalendar
      class="calendar"
      :can-use-calendar-shortcuts="!displayAssignmentDetailsDialog"
      @display-assignment-details="openAssignmentDetailsDialog"
    />
    <FilterableTaskAssignmentList
      class="task-list"
      @refresh-volunteer="refreshVolunteerData"
    />

    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <AssignmentDetailsDialogCard
        v-if="assignmentDetails"
        :assignment-details="assignmentDetails"
        :highlighted-assignee-id="selectedVolunteer?.id"
        @close="closeAssignmentDetailsDialog"
        @unassign="unassignVolunteer"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {
  AssignmentWithDetails,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import { buildUserName } from "@overbookd/user";
import type { UnassignForm } from "~/utils/assignment/assignment";

const DEFAULT_TITLE = "Affect Orga-Tâche";
useHead({ title: DEFAULT_TITLE });

const route = useRoute();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const availabilitiesStore = useVolunteerAvailabilityStore();
const userStore = useUserStore();

const displayAssignmentDetailsDialog = ref<boolean>(false);

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

const volunteers = computed<VolunteerWithAssignmentDuration[]>(
  () => assignVolunteerToTaskStore.volunteers,
);
const selectVolunteer = (volunteer: VolunteerWithAssignmentDuration) => {
  assignVolunteerToTaskStore.selectVolunteer(volunteer);
  refreshVolunteerData(volunteer.id);
};
const unassignVolunteer = (form: UnassignForm) => {
  assignVolunteerToTaskStore.unassign(form);
  refreshVolunteerData(form.assigneeId);
};

const refreshVolunteerData = async (volunteerId: number) => {
  availabilitiesStore.clearVolunteerAvailabilities();
  await Promise.all([
    availabilitiesStore.fetchVolunteerAvailabilities(volunteerId),
    userStore.getVolunteerAssignments(volunteerId),
    userStore.getVolunteerAssignmentStats(volunteerId),
    assignVolunteerToTaskStore.fetchAllAssignmentsFor(volunteerId),
    assignVolunteerToTaskStore.fetchBreakPeriodsFor(volunteerId),
    userStore.getVolunteerTasks(volunteerId),
  ]);
};

onMounted(async () => {
  await assignVolunteerToTaskStore.fetchVolunteers();

  const volunteerId = route.query.volunteer;
  if (!volunteerId) return;
  const volunteer = volunteers.value.find(
    (volunteer) => volunteer.id === +volunteerId,
  );
  if (!volunteer) return;
  assignVolunteerToTaskStore.selectVolunteer(volunteer);
});

const openAssignmentDetailsDialog = () => {
  displayAssignmentDetailsDialog.value = true;
};
const closeAssignmentDetailsDialog = () => {
  displayAssignmentDetailsDialog.value = false;
};
</script>

<style lang="scss" scoped>
$layout-padding: 15px;

.assignment {
  display: flex;
  height: calc(100vh - $header-height - $layout-padding * 2);
  overflow-y: scroll;
}

.calendar {
  flex-grow: 10;
  overflow-y: scroll;
}

.volunteer-list {
  width: 420px;
}

.task-list {
  width: 420px;
}
</style>
