<template>
  <div class="assignment">
    <FilterableVolunteerList class="volunteer-list" />
    <TaskOrgaCalendar
      class="calendar"
      @display-assignment-details="openAssignmentDetailsDialog"
    />
    <FilterableTaskList class="task-list" />
    <SnackNotificationContainer />

    <v-dialog v-model="openTaskAssignmentDialog" width="1000px">
      <AssignmentForm @close-dialog="closeTaskAssignmentDialog" />
    </v-dialog>
    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <TimeSpanDetails @close-dialog="closeAssignmentDetailsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import AssignmentForm from "~/components/organisms/assignment/card/AssignmentForm.vue";
import FilterableTaskList from "~/components/organisms/assignment/list/FilterableTaskList.vue";
import FilterableVolunteerList from "~/components/organisms/assignment/list/FilterableVolunteerList.vue";
import TaskOrgaCalendar from "~/components/organisms/assignment/calendar/TaskOrgaCalendar.vue";
import TimeSpanDetails from "~/components/organisms/assignment/card/TimeSpanDetails.vue";
import {
  AssignmentIdentifier,
  MissingAssignmentTask,
} from "@overbookd/assignment";

export default Vue.extend({
  name: "TaskOrga",
  components: {
    FilterableVolunteerList,
    FilterableTaskList,
    TaskOrgaCalendar,
    AssignmentForm,
    TimeSpanDetails,
    SnackNotificationContainer,
  },
  data: () => ({
    displayAssignmentDetailsDialog: false,
  }),
  head: () => ({
    title: "Affect Tâche-Orga",
  }),
  computed: {
    tasks(): MissingAssignmentTask[] {
      return this.$accessor.assignTaskToVolunteer.tasks;
    },
    openTaskAssignmentDialog: {
      get(): boolean {
        return this.$accessor.assignment.openTaskAssignmentDialog;
      },
      set(): void {
        this.$accessor.assignment.resetAssignment();
      },
    },
  },
  async mounted() {
    this.$accessor.assignment.clearSelectedVariables();
    await this.$accessor.assignTaskToVolunteer.fetchTasks();
  },
  methods: {
    closeTaskAssignmentDialog() {
      this.openTaskAssignmentDialog = false;
    },
    closeAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = false;
    },
    openAssignmentDetailsDialog(identifier: AssignmentIdentifier) {
      console.log(identifier);
      //this.displayAssignmentDetailsDialog = true;
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
</style>
