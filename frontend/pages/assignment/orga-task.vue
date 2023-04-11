<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <OrgaTaskCalendar class="calendar" />
    <FilterableTimespanList class="task-list" />
    <SnackNotificationContainer />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/FilterableVolunteerList.vue";
import FilterableTimespanList from "~/components/organisms/assignment/FilterableTimespanList.vue";
import { Volunteer } from "~/utils/models/assignment";
import OrgaTaskCalendar from "~/components/organisms/assignment/OrgaTaskCalendar.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default Vue.extend({
  name: "OrgaTask",
  components: {
    FilterableVolunteerList,
    FilterableTimespanList,
    OrgaTaskCalendar,
    SnackNotificationContainer,
  },
  computed: {
    volunteers(): Volunteer[] {
      return this.$accessor.assignment.volunteers;
    },
  },
  async mounted() {
    this.$accessor.assignment.clearSelectedVariables();
    await this.$accessor.assignment.fetchVolunteers();
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
