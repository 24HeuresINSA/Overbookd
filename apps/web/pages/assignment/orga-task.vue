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
    <SnackNotificationContainer />

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
import FilterableVolunteerList from "~/components/organisms/assignment/list/FilterableVolunteerList.vue";
import FilterableTaskAssignmentList from "~/components/organisms/assignment/list/FilterableTaskAssignmentList.vue";
import OrgaTaskCalendar from "~/components/organisms/assignment/calendar/OrgaTaskCalendar.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import AssignmentDetails from "~/components/organisms/assignment/card/AssignmentDetails.vue";
import {
  AssignmentWithDetails,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import { UnassignForm } from "~/utils/assignment/assignment";

export default defineComponent({
  name: "OrgaTask",
  components: {
    FilterableVolunteerList,
    FilterableTaskAssignmentList,
    OrgaTaskCalendar,
    SnackNotificationContainer,
    AssignmentDetails,
  },
  data: () => ({
    displayAssignmentDetailsDialog: false,
  }),
  head: () => ({
    title: "Affect Orga-Tâche",
  }),
  computed: {
    volunteers(): VolunteerWithAssignmentDuration[] {
      return this.$accessor.assignVolunteerToTask.volunteers;
    },
    assignmentDetails(): AssignmentWithDetails | null {
      return this.$accessor.assignVolunteerToTask.assignmentDetails;
    },
  },
  async mounted() {
    await this.$accessor.assignVolunteerToTask.fetchVolunteers();

    const volunteerId = +this.$route.query.volunteer;
    if (!volunteerId) return;
    const volunteer = this.volunteers.find(
      (volunteer) => volunteer.id === volunteerId,
    );
    if (!volunteer) return;
    this.$accessor.assignVolunteerToTask.selectVolunteer(volunteer);
  },
  methods: {
    closeAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = false;
    },
    openAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = true;
    },
    selectVolunteer(volunteer: VolunteerWithAssignmentDuration) {
      this.$accessor.assignVolunteerToTask.selectVolunteer(volunteer);
    },
    unassignVolunteer(form: UnassignForm) {
      this.$accessor.assignVolunteerToTask.unassign(form);
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
