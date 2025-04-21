<template>
  <div class="assignment">
    <FilterableVolunteerList
      class="volunteer-list"
      @select-volunteer="selectVolunteer"
    />
    <TaskOrgaCalendar
      class="calendar"
      @display-assignment-details="openAssignmentDetailsDialog"
      @select-assignment="selectAssignment"
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
</template>

<script lang="ts" setup>
import type {
  AssignableVolunteer,
  Assignment,
  AssignmentSummary,
} from "@overbookd/assignment";

useHead({ title: "Affect Tâche-Orga" });

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

assignTaskToVolunteerStore.fetchTasks();

const volunteer = computed<AssignableVolunteer | null>(
  () => assignTaskToVolunteerStore.selectedVolunteer,
);
const assignment = computed<Assignment | null>(
  () => assignTaskToVolunteerStore.selectedAssignment,
);

const openFunnelDialog = ref<boolean>(false);
const closeFunnelDialog = () => (openFunnelDialog.value = false);
const refreshTaskAssignments = ({ taskId }: Assignment) => {
  assignTaskToVolunteerStore.selectTask(taskId);
};

const selectVolunteer = (volunteer: AssignableVolunteer) => {
  assignTaskToVolunteerStore.selectVolunteer(volunteer);
  openFunnelDialog.value = true;
};
const selectAssignment = (assignment: AssignmentSummary) => {
  const taskId = assignTaskToVolunteerStore.selectedTask?.id;
  console.log("taskId", taskId);
  if (!taskId) return;
  assignTaskToVolunteerStore.selectAssignment(assignment);
};

const displayAssignmentDetailsDialog = ref<boolean>(false);
const openAssignmentDetailsDialog = () =>
  (displayAssignmentDetailsDialog.value = true);
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
