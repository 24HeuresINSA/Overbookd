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
</template>

<script lang="ts" setup>
import type {
  AssignableVolunteer,
  AssignmentSummary,
} from "@overbookd/assignment";

useHead({ title: "Affect Tâche-Orga" });

const assignTaskToVolunteer = useAssignTaskToVolunteerStore();

assignTaskToVolunteer.fetchTasks();

const selectVolunteer = (volunteer: AssignableVolunteer) => {
  assignTaskToVolunteer.selectVolunteer(volunteer);
};
const selectAssignment = (assignment: AssignmentSummary) => {
  const taskId = assignTaskToVolunteer.selectedTask?.id;
  if (!taskId) return;
  assignTaskToVolunteer.selectAssignment(assignment);
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
