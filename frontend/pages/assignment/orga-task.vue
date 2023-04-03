<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <OrgaTaskCalendar class="calendar" />
    <FilterableTimespanList class="task-list" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/FilterableVolunteerList.vue";
import FilterableTimespanList from "~/components/organisms/assignment/FilterableTimespanList.vue";
import { Volunteer } from "~/utils/models/assignment";
import OrgaTaskCalendar from "~/components/organisms/assignment/OrgaTaskCalendar.vue";

export default Vue.extend({
  name: "OrgaTask",
  components: {
    FilterableVolunteerList,
    FilterableTimespanList,
    OrgaTaskCalendar,
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
$header-footer-height: 100px;

.assignment-container {
  padding: 0;
  left: 0;
  top: 0;
  max-width: none;
  margin: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
  overflow-y: hidden;
}

.volunteer-list {
  width: 350px;
  height: calc(100vh - #{$header-footer-height});
}

.calendar {
  width: 1000px;
  height: 100%;
}

.task-list {
  max-width: 450px;
  height: calc(100vh - #{$header-footer-height});
}
</style>
