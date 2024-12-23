<template>
  <div class="assignment">
    <FilterableVolunteerList
      class="volunteer-list"
      @select-volunteer="selectVolunteer"
    />
    <OrgaTaskCalendar
      class="calendar"
      @display-assignment-details="openAssignmentDetailsDialog"
    />
    <FilterableTaskAssignmentList class="task-list" />

    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <AssignmentDetailsDialogCard
        v-if="assignmentDetails"
        :assignment-details="assignmentDetails"
        @close-dialog="closeAssignmentDetailsDialog"
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

const displayAssignmentDetailsDialog = ref<boolean>(false);

const assignmentDetails = computed<AssignmentWithDetails | null>(
  () => assignVolunteerToTaskStore.assignmentDetails,
);

const title = computed<string>(() => {
  const selectedVolunteer = assignVolunteerToTaskStore.selectedVolunteer;
  if (!selectedVolunteer) return DEFAULT_TITLE;
  return `${buildUserName(selectedVolunteer)} affect`;
});
watch(title, (newTitle) => (document.title = newTitle));

const volunteers = computed<VolunteerWithAssignmentDuration[]>(
  () => assignVolunteerToTaskStore.volunteers,
);
const selectVolunteer = (volunteer: VolunteerWithAssignmentDuration) => {
  assignVolunteerToTaskStore.selectVolunteer(volunteer);
};
const unassignVolunteer = (form: UnassignForm) => {
  assignVolunteerToTaskStore.unassign(form);
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
.assignment {
  display: flex;
  height: calc(100vh - $header-height);
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
