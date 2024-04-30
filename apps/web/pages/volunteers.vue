<template>
  <div class="volunteers-page">
    <div class="filters">
      <VolunteerListFilters
        :search="filters.search"
        :teams="filters.teams"
        :excluded-teams="filters.excludedTeams"
        @change:search="filters.search = $event"
        @change:teams="filters.teams = $event"
        @change:excluded-teams="filters.excludedTeams = $event"
      />

      <VolunteerStatsExportFilters
        :filtered-volunteers="displayedVolunteers"
        @change:statsMode="isStatsModeActive = $event"
      />
    </div>

    <div class="table-container">
      <VolunteerList
        v-if="!isStatsModeActive"
        :volunteers="displayedVolunteers"
        @open-dialog="openVolunteerInfoDialog"
        @click:team="addTeamInFilters"
      />
      <VolunteerStatsTable v-else :volunteers="displayedVolunteers" />
    </div>

    <v-dialog v-model="isVolunteerInfoDialogOpen">
      <VolunteerInformation @updated="closeVolunteerInfoDialog" />
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import VolunteerStatsTable from "~/components/molecules/stats/VolunteerStatsTable.vue";
import VolunteerInformation from "~/components/organisms/user/VolunteerInformation.vue";
import VolunteerListFilters from "~/components/molecules/user/filters/VolunteerListFilters.vue";
import VolunteerStatsExportFilters from "~/components/molecules/user/filters/VolunteerStatsExportFilters.vue";
import VolunteerList from "~/components/organisms/user/VolunteerList.vue";
import {
  keepMatchingSearchCriteria,
  Searchable,
} from "~/utils/search/search.utils";
import { UserPersonalData } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";
import { excludeMembersOf, keepMembersOf } from "~/utils/search/search-team";
import { toSearchable } from "~/utils/search/search-user";

type VolunteersData = {
  filters: {
    search: string;
    teams: Team[];
    excludedTeams: Team[];
  };

  isVolunteerInfoDialogOpen: boolean;
  isStatsModeActive: boolean;
};

export default Vue.extend({
  name: "Volunteers",
  components: {
    VolunteerListFilters,
    VolunteerInformation,
    SnackNotificationContainer,
    VolunteerStatsTable,
    VolunteerStatsExportFilters,
    VolunteerList,
  },
  data: (): VolunteersData => ({
    filters: {
      search: "",
      teams: [],
      excludedTeams: [],
    },

    isVolunteerInfoDialogOpen: false,
    isStatsModeActive: false,
  }),
  head: () => ({
    title: "Liste des bénévoles",
  }),

  computed: {
    volunteers(): UserPersonalData[] {
      return this.$accessor.user.volunteers;
    },
    searchableVolunteers(): Searchable<UserPersonalData>[] {
      return this.volunteers.map(toSearchable);
    },
    displayedVolunteers(): UserPersonalData[] {
      const matchTeams = keepMembersOf(this.filters.teams);
      const matchExcludedTeams = excludeMembersOf(this.filters.excludedTeams);
      const matchName = this.filterVolunteersByName(this.filters.search);
      return this.searchableVolunteers.filter((volunteer) => {
        return (
          matchTeams(volunteer) &&
          matchExcludedTeams(volunteer) &&
          matchName(volunteer)
        );
      });
    },
  },

  async mounted() {
    await this.$accessor.user.fetchVolunteers();
  },

  methods: {
    filterVolunteersByName(
      search: string,
    ): (volunteer: Searchable<UserPersonalData>) => boolean {
      return keepMatchingSearchCriteria(search);
    },

    addTeamInFilters(team: Team) {
      if (!this.filters.teams.some((t) => t.code === team.code)) {
        this.filters.teams = [...this.filters.teams, team];
      }
    },

    openVolunteerInfoDialog() {
      this.isVolunteerInfoDialogOpen = true;
    },

    closeVolunteerInfoDialog() {
      this.isVolunteerInfoDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.volunteers-page {
  display: flex;
  gap: 1em;
  margin-left: 1em;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    margin-left: 0;
  }
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 20%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}

.table-container {
  width: 80%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}
</style>
