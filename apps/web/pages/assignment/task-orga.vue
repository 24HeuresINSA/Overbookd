<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <TaskOrgaCalendar
      class="calendar"
      @display-time-span-details="openTimeSpanDetailsDialog"
    />
    <FilterableTaskList class="task-list" />
    <SnackNotificationContainer />

    <v-dialog v-model="openTaskAssignmentDialog" width="1000px">
      <AssignmentForm @close-dialog="closeTaskAssignmentDialog" />
    </v-dialog>
    <v-dialog v-model="displayTimeSpanDetailsDialog" width="1000px">
      <TimeSpanDetails @close-dialog="closeTimeSpanDetailsDialog" />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import AssignmentForm from "~/components/organisms/assignment/card/AssignmentForm.vue";
import FilterableTaskList from "~/components/organisms/assignment/list/FilterableTaskList.vue";
import FilterableVolunteerList from "~/components/organisms/assignment/list/FilterableVolunteerList.vue";
import TaskOrgaCalendar from "~/components/organisms/assignment/calendar/TaskOrgaCalendar.vue";
import TimeSpanDetails from "~/components/organisms/assignment/card/TimeSpanDetails.vue";
import { FtWithTimeSpan } from "~/utils/models/ft-time-span.model";

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
    displayTimeSpanDetailsDialog: false,
  }),
  head: () => ({
    title: "Affect Tâche-Orga",
  }),
  computed: {
    ftWithTimeSpans(): FtWithTimeSpan[] {
      return this.$accessor.assignment.fts;
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
    await this.$accessor.assignment.fetchFtsWithTimeSpans();
  },
  methods: {
    closeTaskAssignmentDialog() {
      this.openTaskAssignmentDialog = false;
    },
    closeTimeSpanDetailsDialog() {
      this.displayTimeSpanDetailsDialog = false;
    },
    openTimeSpanDetailsDialog(timeSpanId: number) {
      this.$accessor.assignment.fetchTimeSpanDetails(timeSpanId);
      this.displayTimeSpanDetailsDialog = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.assignment-container {
  width: 100%;
  height: 100%;
  max-width: 100vw;
  padding: 0;
  left: 0;
  top: 0;
  margin-left: 0;
  margin-right: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
}

.volunteer-list {
  max-width: 20%;
  height: 100%;
}

.calendar {
  width: 55%;
  height: calc(100% - 50px);
}

.task-list {
  max-width: 25%;
  height: 100%;
}
</style>
