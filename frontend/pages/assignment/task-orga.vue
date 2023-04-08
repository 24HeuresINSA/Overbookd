<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <TaskOrgaCalendar class="calendar" />
    <FilterableFtList class="task-list" />
    <v-dialog v-model="openTaskAssignmentDialog" width="1000px">
      <AssignmentForm @close-dialog="closeTaskAssignmentDialog" />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/FilterableVolunteerList.vue";
import { FtWithTimespan } from "~/utils/models/ftTimespan";
import FilterableFtList from "~/components/organisms/assignment/FilterableFtList.vue";
import TaskOrgaCalendar from "~/components/organisms/assignment/TaskOrgaCalendar.vue";
import AssignmentForm from "~/components/organisms/assignment/AssignmentForm.vue";

export default Vue.extend({
  name: "TaskOrga",
  components: {
    FilterableVolunteerList,
    FilterableFtList,
    TaskOrgaCalendar,
    AssignmentForm,
  },
  computed: {
    ftWithTimespans(): FtWithTimespan[] {
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
    await this.$accessor.assignment.fetchFtsWithTimespans();
  },
  methods: {
    closeTaskAssignmentDialog() {
      this.openTaskAssignmentDialog = false;
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
