<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <OrgaTaskCalendar
      class="calendar"
      @display-timespan-details="openTimespanDetailsDialog"
    />
    <FilterableTimespanList class="task-list" />
    <SnackNotificationContainer />

    <v-dialog v-model="displayTimespanDetailsDialog" width="1000px">
      <TimespanDetails @close-dialog="closeTimespanDetailsDialog" />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/list/FilterableVolunteerList.vue";
import FilterableTimespanList from "~/components/organisms/assignment/list/FilterableTimespanList.vue";
import { Volunteer } from "~/utils/models/assignment";
import OrgaTaskCalendar from "~/components/organisms/assignment/calendar/OrgaTaskCalendar.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import TimespanDetails from "~/components/organisms/assignment/card/TimespanDetails.vue";

export default Vue.extend({
  name: "OrgaTask",
  components: {
    FilterableVolunteerList,
    FilterableTimespanList,
    OrgaTaskCalendar,
    SnackNotificationContainer,
    TimespanDetails,
  },
  data: () => ({
    displayTimespanDetailsDialog: false,
  }),
  head: () => ({
    title: "Affect Orga-Tâche",
  }),
  computed: {
    volunteers(): Volunteer[] {
      return this.$accessor.assignment.volunteers;
    },
  },
  async mounted() {
    this.$accessor.assignment.clearSelectedVariables();
    await this.$accessor.assignment.fetchVolunteers();

    const volunteerId = +this.$route.query.volunteer;
    if (!volunteerId) return;
    const volunteer = this.volunteers.find(
      (volunteer) => volunteer.id === volunteerId
    );
    if (!volunteer) return;
    this.$accessor.assignment.selectVolunteer(volunteer);
  },
  methods: {
    closeTimespanDetailsDialog() {
      this.displayTimespanDetailsDialog = false;
    },
    openTimespanDetailsDialog(timespanId: number) {
      this.$accessor.assignment.fetchTimespanDetails(timespanId);
      this.displayTimespanDetailsDialog = true;
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
