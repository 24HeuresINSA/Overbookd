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

          <v-switch
            v-if="canManageUsers"
            v-model="filters.isCandidate"
            label="Membres non validés"
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
        :items="displayedUsers"
        class="elevation-1"
        :items-per-page="20"
        disable-sort
      >
        <template #item.name="{ item }">
          {{ formatUserName(item) }}
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

        <template #item.charisma="{ item }">
          {{ item.charisma }}
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
      <UserInformation @close-dialog="closeUserInformationDialog" />
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import VolunteerStatsTable from "~/components/molecules/stats/VolunteerStatsTable.vue";
import UserInformation from "~/components/organisms/user/data/UserInformation.vue";
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
    isCandidate: boolean;
  };

  isUserInformationDialogOpen: boolean;
  isStatsModeActive: boolean;

  planningLoading: boolean;
}

export default Vue.extend({
  name: "Volunteers",
  components: {
    UserInformation,
    SnackNotificationContainer,
    TeamChip,
    VolunteerStatsTable,
    SearchTeams,
  },
  data: (): VolunteersData => ({
    headers: [
      { text: "Prénom Nom (Surnom)", value: "name" },
      { text: "Equipes", value: "teams" },
      { text: "Charisme", value: "charisma" },
      { text: "Actions", value: "actions" },
    ],

    filters: {
      search: "",
      teams: [],
      isCandidate: false,
    },

    isUserInformationDialogOpen: false,
    isStatsModeActive: false,

    planningLoading: false,
  }),
  head: () => ({
    title: "Liste des bénévoles",
  }),

  computed: {
    users(): UserPersonnalData[] {
      return this.filters.isCandidate
        ? this.$accessor.user.candidates
        : this.$accessor.user.volunteers;
    },
    searchableUsers(): Searchable<UserPersonnalData>[] {
      return this.users.map((user) => ({
        ...user,
        searchable: SlugifyService.apply(
          `${user.firstname} ${user.lastname} ${user.nickname}`,
        ),
      }));
    },
    displayedUsers(): UserPersonnalData[] {
      return this.searchableUsers.filter((user) => {
        return (
          this.filterUserByTeams(this.filters.teams)(user) &&
          this.filterUserByName(this.filters.search)(user)
        );
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
    await this.$accessor.user.fetchCandidates();
    await this.$accessor.user.fetchVolunteers();
  },

  methods: {
    openInformationDialog(user: UserPersonnalData) {
      this.$accessor.user.setSelectedUser(user);
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

      const csvContent = this.users.map((user: UserPersonnalData) => {
        return [
          user.firstname,
          user.lastname,
          user.nickname,
          user.charisma,
          user.teams?.join(", ") ?? "",
          user.email,
          user.birthdate,
          user.phone,
          user.comment?.replace(lineReturnRegex, " ") ?? "",
        ].join(";");
      });

      const csv = [csvHeader, ...csvContent].join("\n");
      const regex = new RegExp(/undefined/i, "g");

      const parsedCSV = csv.replace(regex, "");
      this.download("utilisateurs.csv", parsedCSV);
    },

    openCalendar(userId: number) {
      window.open(`/planning/${userId}`, "_blank");
    },

    filterUserByName(
      search: string,
    ): (user: Searchable<UserPersonnalData>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },

    filterUserByTeams(
      teamsSearched: Team[],
    ): (user: UserPersonnalData) => boolean {
      if (teamsSearched.length === 0) return () => true;

      return (user) =>
        teamsSearched.every((teamSearched) =>
          user.teams.some((userTeamCode) => teamSearched.code === userTeamCode),
        );
    },

    async exportPlannings() {
      this.planningLoading = true;
      await this.$accessor.planning.fetchAllPdfPlannings(
        this.displayedUsers.filter(({ charisma }) => charisma > 0),
      );
      this.volunteerPlannings.map(({ volunteer, planningBase64Data }) =>
        download(planningBase64Data, volunteer),
      );
      this.planningLoading = false;
    },

    getPhoneLink(phone: string) {
      return formatPhoneLink(phone);
    },

    formatUserName(user: UserPersonnalData) {
      return formatUserNameWithNickname(user);
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
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 20%;

  &__stats {
    width: 100%;

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
}

@media screen and (max-width: 600px) {
  .volunteers-page {
    flex-direction: column;
  }

  .filters {
    width: 100%;

    &__stats {
      display: none;
    }
  }
}

.table-container {
  width: 100%;

  .list-actions {
    display: flex;
  }
}
</style>
