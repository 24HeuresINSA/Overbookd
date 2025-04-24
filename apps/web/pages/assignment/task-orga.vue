<template>
  <div class="assignment">
    <FilterableVolunteerList
      class="volunteer-list"
      @select-volunteer="selectVolunteer"
    />
    <TaskOrgaCalendar
      class="calendar"
      :can-use-calendar-shortcuts="canUseCalendarShortcuts"
      @open-assignment-details="openAssignmentDetailsDialog"
    />
    <FilterableTaskList class="task-list" />
  </div>

  <v-dialog v-model="openFunnelDialog" width="1000px">
    <AssignmentFunnelDialogCard
      v-if="volunteer && assignment"
      :volunteer="volunteer"
      :assignment="assignment"
      @close="closeFunnelDialog"
      @volunteers-assigned="refreshTaskAssignments"
    />
  </v-dialog>
  <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
    <AssignmentDetailsDialogCard
      v-if="assignmentDetails"
      :assignment-details="assignmentDetails"
      @close="closeAssignmentDetailsDialog"
      @unassign="unassignVolunteer"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type {
  AssignmentWithDetails,
  AssignableVolunteer,
  Assignment,
} from "@overbookd/assignment";
import type { UnassignForm } from "~/utils/assignment/assignment";

useHead({ title: "Affect Tâche-Orga" });

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

assignTaskToVolunteerStore.fetchTasks();

const volunteer = computed<AssignableVolunteer | null>(
  () => assignTaskToVolunteerStore.selectedVolunteer,
);
const assignment = computed<Assignment | null>(
  () => assignTaskToVolunteerStore.selectedAssignment,
);

const canUseCalendarShortcuts = computed<boolean>(() => {
  if (displayAssignmentDetailsDialog.value || openFunnelDialog.value)
    return false;
  return true;
});

const openFunnelDialog = ref<boolean>(false);
const closeFunnelDialog = () => (openFunnelDialog.value = false);
const refreshTaskAssignments = ({ taskId }: Assignment) => {
  assignTaskToVolunteerStore.selectTask(taskId);
};

const selectVolunteer = (volunteer: AssignableVolunteer) => {
  assignTaskToVolunteerStore.selectVolunteer(volunteer);
  openFunnelDialog.value = true;
};

const assignmentDetails = computed<AssignmentWithDetails | null>(
  () => assignTaskToVolunteerStore.assignmentDetails,
);
const unassignVolunteer = (form: UnassignForm) => {
  assignTaskToVolunteerStore.unassign(form);
};

const displayAssignmentDetailsDialog = ref<boolean>(false);
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
