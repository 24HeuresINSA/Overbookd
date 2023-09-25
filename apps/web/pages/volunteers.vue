<template>
  <div class="volunteers-page">
    <div class="filters">
      <v-card class="filters_volunteers">
        <v-card-title>Filtres</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="filters.search"
            label="Recherche"
            :disabled="isStatsModeActive"
          />

          <SearchTeams
            v-model="filters.teams"
            label="Équipe"
            :boxed="false"
            :disabled="isStatsModeActive"
          />
        </v-card-text>
      </v-card>

      <v-card v-if="canManageUsers" class="filters__stats">
        <v-card-title>Mode stats</v-card-title>
        <v-card-text class="stats-content">
          <v-switch v-model="isStatsModeActive" label="Afficher les stats" />

          <v-btn :allow-overflow="false" @click="exportCSV">
            exporter les bénévoles
          </v-btn>

          <v-btn :loading="planningLoading" @click="exportPlannings">
            exporter les plannings
          </v-btn>
        </v-card-text>
      </v-card>
    </div>

    <div class="table-container">
      <v-data-table
        v-if="!isStatsModeActive"
        :headers="headers"
        :items="displayedVolunteers"
        class="elevation-1"
        :items-per-page="20"
        disable-sort
      >
        <template #item.firstname="{ item }">
          {{ formatVolunteerName(item) }}
        </template>

        <template #item.actions="{ item }">
          <div class="list-actions">
            <v-btn icon small @click="openInformationDialog(item)">
              <v-icon small>mdi-information-outline</v-icon>
            </v-btn>

            <v-btn icon small :href="getPhoneLink(item.phone)">
              <v-icon small>mdi-phone</v-icon>
            </v-btn>

            <v-btn icon small :href="`mailto:${item.email}`">
              <v-icon small>mdi-email</v-icon>
            </v-btn>

            <v-btn icon small @click="openCalendar(item.id)">
              <v-icon small>mdi-calendar</v-icon>
            </v-btn>
          </div>
        </template>

        <template #item.teams="{ item }">
          <TeamChip
            v-for="team of item.teams"
            :key="team"
            :team="team"
            with-name
          />
        </template>

        <template #no-data> Aucun bénévole trouvé </template>
      </v-data-table>

      <VolunteerStatsTable v-else />
    </div>

    <v-dialog v-model="isUserInformationDialogOpen">
      <VolunteerInformation @close-dialog="closeUserInformationDialog" />
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
import { download } from "~/utils/planning/download";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
} from "~/utils/user/user.utils";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import { MANAGE_USERS } from "@overbookd/permission";
import { UserPersonnalData } from "@overbookd/user";
import { Header } from "~/utils/models/data-table.model";
import { VolunteerPlanning } from "~/store/planning";
import { Team } from "~/utils/models/team.model";

interface VolunteersData {
  headers: Header[];

  filters: {
    search: string;
    teams: Team[];
  };

  isUserInformationDialogOpen: boolean;
  isStatsModeActive: boolean;

  planningLoading: boolean;
}

export default Vue.extend({
  name: "Volunteers",
  components: {
    VolunteerInformation,
    SnackNotificationContainer,
    TeamChip,
    VolunteerStatsTable,
    SearchTeams,
  },
  data: (): VolunteersData => ({
    headers: [
      { text: "Prénom Nom (Surnom)", value: "firstname" },
      { text: "Equipes", value: "teams", sortable: false },
      { text: "Charisme", value: "charisma" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    filters: {
      search: "",
      teams: [],
    },

    isUserInformationDialogOpen: false,
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
    volunteerPlannings(): VolunteerPlanning[] {
      return this.$accessor.planning.volunteerPlannings;
    },
    canManageUsers(): boolean {
      return this.$accessor.user.can(MANAGE_USERS);
    },
  },

  async mounted() {
    await this.$accessor.user.fetchVolunteers();
  },

  methods: {
    openInformationDialog(volunteer: UserPersonnalData) {
      this.$accessor.user.setSelectedUser(volunteer);
      this.isUserInformationDialogOpen = true;
    },

    download(filename: string, text: string) {
      // We use the 'a' HTML element to incorporate file generation into
      // the browser rather than server-side
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text),
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    async exportCSV() {
      // Parse data into a CSV string to be passed to the download function
      const lineReturnRegex = new RegExp("(\\r\\n|\\n|\\r)", "gm");
      const csvHeader =
        "Prenom;Nom;Surnom;Charisme;Equipes;Email;Date de naissance;Telephone;Commentaire";

      const csvContent = this.volunteers.map((volunteer: UserPersonnalData) => {
        return [
          volunteer.firstname,
          volunteer.lastname,
          volunteer.nickname,
          volunteer.charisma,
          volunteer.teams?.join(", ") ?? "",
          volunteer.email,
          volunteer.birthdate,
          volunteer.phone,
          volunteer.comment?.replace(lineReturnRegex, " ") ?? "",
        ].join(";");
      });

      const csv = [csvHeader, ...csvContent].join("\n");
      const regex = new RegExp(/undefined/i, "g");

      const parsedCSV = csv.replace(regex, "");
      this.download("utilisateurs.csv", parsedCSV);
    },

    openCalendar(volunteerId: number) {
      window.open(`/planning/${volunteerId}`, "_blank");
    },

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

    async exportPlannings() {
      this.planningLoading = true;
      await this.$accessor.planning.fetchAllPdfPlannings(
        this.displayedVolunteers.filter(({ charisma }) => charisma > 0),
      );
      this.volunteerPlannings.map(({ volunteer, planningBase64Data }) =>
        download(planningBase64Data, volunteer),
      );
      this.planningLoading = false;
    },

    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },

    formatVolunteerName(volunteer: UserPersonnalData) {
      return formatUserNameWithNickname(volunteer);
    },

    closeUserInformationDialog() {
      this.isUserInformationDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.volunteers-page {
  display: flex;
  gap: 1em;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
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

  &__stats {
    width: 100%;
    @media screen and (max-width: $mobile-max-width) {
      display: none;
    }

    .stats-content {
      display: flex;
      flex-direction: column;
      gap: 1em;
      text-align: start;
    }
  }
}

.table-container {
  width: 80%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}

.list-actions {
  @media screen and (max-width: $mobile-max-width) {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
}
</style>
