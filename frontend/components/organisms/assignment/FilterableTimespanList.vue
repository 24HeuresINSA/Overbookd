<template>
  <v-card class="filterable-user-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="filteredVolunteers.length"
        class="filters"
        type="timespan"
        @change:search="volunteer = $event"
        @change:teams="teams = $event"
      ></AssignmentFilters>
      <v-divider />
      <div class="user-list">
        <VolunteerList :volunteers="filteredVolunteers" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Fuse from "fuse.js";
import VolunteerList from "~/components/molecules/assignment/VolunteerList.vue";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import { Team } from "~/utils/models/team";
import { Volunteer, AssignmentModes } from "~/utils/models/assignment";

export default Vue.extend({
  name: "FilterableTimespanList",
  components: { VolunteerList, AssignmentFilters },
  data: () => ({
    teams: [],
    volunteer: "",
  }),
  computed: {
    filteredVolunteers(): Volunteer[] {
      const filteredVolunteers = this.$accessor.assignment.volunteers.filter(
        (volunteer) => {
          return (
            this.filterVolunteerByValidity()(volunteer) &&
            this.filterVolunteerByTeams(this.teams)(volunteer)
          );
        }
      );
      return this.fuzzyFindVolunteer(filteredVolunteers, this.volunteer);
    },
    isOrgaTaskMode(): boolean {
      return this.$accessor.assignment.mode === AssignmentModes.ORGA_TASK;
    },
    hasSelectedVolunteer(): boolean {
      return !!this.$accessor.assignment.selectedVolunteer;
    },
  },
  methods: {
    filterVolunteerByValidity(): (volunteer: Volunteer) => boolean {
      return (volunteer) =>
        volunteer.teams.map((team) => team).includes("soft") ||
        volunteer.teams.map((team) => team).includes("hard");
    },
    filterVolunteerByTeams(
      teamsSearched: Team[]
    ): (volunteer: Volunteer) => boolean {
      return teamsSearched.length > 0
        ? (volunteer) =>
            volunteer.teams
              .map((team) => team)
              .some((code) =>
                teamsSearched.map((team) => team.code).includes(code)
              )
        : () => true;
    },
    fuzzyFindVolunteer(volunteers: Volunteer[], search?: string): Volunteer[] {
      if (!search) return volunteers;
      const fuse = new Fuse(volunteers, {
        keys: ["firstname", "lastname"],
        threshold: 0.4,
      });
      return fuse.search(search).map((e) => e.item);
    },
  },
});
</script>

<style lang="scss" scoped>
.filterable-user-list {
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  .v-card__text {
    height: fit-content;
  }
}

.filters {
  width: 100%;
  height: 140px;
}

.user-list {
  width: 100%;
  max-height: calc(100vh - 260px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
</style>
