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
    <SnackNotificationContainer />

    <v-dialog v-model="openFunnelDialog" width="1000px">
      <AssignmentFunnel
        v-if="volunteer && assignment"
        :volunteer="volunteer"
        :assignment="assignment"
        @close-dialog="closeFunnelDialog"
        @volunteers-assigned="refreshTaskAssignments"
      />
    </v-dialog>
    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <AssignmentDetails
        v-if="assignmentDetails"
        :assignment-details="assignmentDetails"
        @close-dialog="closeAssignmentDetailsDialog"
        @unassign="unassignVolunteer"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import AssignmentFunnel from "~/components/organisms/assignment/card/AssignmentFunnel.vue";
import FilterableTaskList from "~/components/organisms/assignment/list/FilterableTaskList.vue";
import FilterableVolunteerList from "~/components/organisms/assignment/list/FilterableVolunteerList.vue";
import TaskOrgaCalendar from "~/components/organisms/assignment/calendar/TaskOrgaCalendar.vue";
import AssignmentDetails from "~/components/organisms/assignment/card/AssignmentDetails.vue";
import {
  AssignableVolunteer,
  Assignment,
  AssignmentSummary,
  AssignmentWithDetails,
  MissingAssignmentTask,
} from "@overbookd/assignment";
import { UnassignForm } from "~/utils/assignment/assignment";

type OrgaTaskData = {
  openFunnelDialog: boolean;
  displayAssignmentDetailsDialog: boolean;
};

export default defineComponent({
  name: "TaskOrga",
  components: {
    FilterableVolunteerList,
    FilterableTaskList,
    TaskOrgaCalendar,
    AssignmentFunnel,
    AssignmentDetails,
    SnackNotificationContainer,
  },
  data: (): OrgaTaskData => ({
    openFunnelDialog: false,
    displayAssignmentDetailsDialog: false,
  }),
  head: () => ({
    title: "Affect Tâche-Orga",
  }),
  computed: {
    tasks(): MissingAssignmentTask[] {
      return this.$accessor.assignTaskToVolunteer.tasks;
    },
    volunteer(): AssignableVolunteer | null {
      return this.$accessor.assignTaskToVolunteer.selectedVolunteer;
    },
    assignment(): Assignment | null {
      return this.$accessor.assignTaskToVolunteer.selectedAssignment;
    },
    assignmentDetails(): AssignmentWithDetails | null {
      return this.$accessor.assignTaskToVolunteer.assignmentDetails;
    },
  },
  async mounted() {
    await this.$accessor.assignTaskToVolunteer.fetchTasks();
  },
  methods: {
    closeFunnelDialog() {
      this.openFunnelDialog = false;
    },
    refreshTaskAssignments({ taskId }: Assignment) {
      this.$accessor.assignTaskToVolunteer.selectTask(taskId);
    },
    closeAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = false;
    },
    openAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = true;
    },
    selectVolunteer(volunteer: AssignableVolunteer) {
      this.$accessor.assignTaskToVolunteer.selectVolunteer(volunteer);
      this.openFunnelDialog = true;
    },
    selectAssignment(assignment: AssignmentSummary) {
      const taskId = this.$accessor.assignTaskToVolunteer.selectedTask?.id;
      if (!taskId) return;
      this.$accessor.assignTaskToVolunteer.selectAssignment(assignment);
    },
    unassignVolunteer(form: UnassignForm) {
      this.$accessor.assignTaskToVolunteer.unassign(form);
    },
  },
});
</script>

<style lang="scss" scoped>
.assignment {
  display: flex;
  height: calc(100vh - #{$header-height} - #{$footer-height});
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
