<template>
  <div class="volunteers-page">
    <div class="filters">
      <VolunteerListFilters
        :disabled="isStatsModeActive"
        @change:search="filters.search = $event"
        @change:teams="filters.teams = $event"
      />

      <VolunteerStatsExportFilters
        :planningLoading="planningLoading"
        :filtered-volunteers="displayedVolunteers"
        @change:statsMode="isStatsModeActive = $event"
      />
    </div>

    <div class="table-container">
      <VolunteerList
      v-if="!isStatsModeActive"
      :volunteers="displayedVolunteers"
      @open-dialog="openVolunteerInfoDialog"
      />
      <VolunteerStatsTable v-else />
    </div>

    <v-dialog v-model="isVolunteerInfoDialogOpen">
      <VolunteerInformation @close-dialog="closeVolunteerInfoDialog" />
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import VolunteerStatsTable from "~/components/molecules/stats/VolunteerStatsTable.vue";
import VolunteerInformation from "~/components/organisms/user/data/VolunteerInformation.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import VolunteerListFilters from "~/components/molecules/user/filters/VolunteerListFilters.vue";
import VolunteerStatsExportFilters from "~/components/molecules/user/filters/VolunteerStatsExportFilters.vue";
import VolunteerList from "~/components/organisms/user/data/VolunteerList.vue";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import { UserPersonnalData } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";

interface VolunteersData {
  filters: {
    search: string;
    teams: Team[];
  };

  isVolunteerInfoDialogOpen: boolean;
  isStatsModeActive: boolean;
  planningLoading: boolean;
}

export default Vue.extend({
  name: "Volunteers",
  components: {
    VolunteerListFilters,
    VolunteerInformation,
    SnackNotificationContainer,
    TeamChip,
    VolunteerStatsTable,
    SearchTeams,
    VolunteerStatsExportFilters,
    VolunteerList
},
  data: (): VolunteersData => ({
    filters: {
      search: "",
      teams: [],
    },

    isVolunteerInfoDialogOpen: false,
    isStatsModeActive: false,
    planningLoading: false,
  }),
  head: () => ({
    title: "Liste des bénévoles",
  }),

  computed: {
    volunteers(): UserPersonnalData[] {
      return this.$accessor.user.volunteers;
    },
    searchableVolunteers(): Searchable<UserPersonnalData>[] {
      return this.volunteers.map((volunteer) => ({
        ...volunteer,
        searchable: SlugifyService.apply(
          `${volunteer.firstname} ${volunteer.lastname} ${volunteer.nickname}`,
        ),
      }));
    },
    displayedVolunteers(): UserPersonnalData[] {
      const matchTeams = this.filterVolunteersByTeams(this.filters.teams);
      const matchName = this.filterVolunteersByName(this.filters.search);
      return this.searchableVolunteers.filter((volunteer) => {
        return matchTeams(volunteer) && matchName(volunteer);
      });
    },
  },

  async mounted() {
    await this.$accessor.user.fetchVolunteers();
  },

  methods: {
    filterVolunteersByName(
      search: string,
    ): (volunteer: Searchable<UserPersonnalData>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },

    filterVolunteersByTeams(
      teamsSearched: Team[],
    ): (volunteer: UserPersonnalData) => boolean {
      if (teamsSearched.length === 0) return () => true;

      return (volunteer) =>
        teamsSearched.every((teamSearched) =>
          volunteer.teams.some((teamCode) => teamSearched.code === teamCode),
        );
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
