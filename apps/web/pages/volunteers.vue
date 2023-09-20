<template>
  <div>
    <div style="width: 100%; display: grid">
      <v-row>
        <v-col md="2">
          <v-card style="margin-bottom: 5%">
            <v-card-title>Filtres</v-card-title>
            <v-card-text style="display: flex; flex-direction: column">
              <v-text-field
                v-model="filters.search"
                label="Recherche"
                :disabled="isStatsModeActive"
              ></v-text-field>
              <SearchTeams
                v-model="filters.teams"
                label="Équipe"
                :boxed="false"
                :disabled="isStatsModeActive"
              ></SearchTeams>

              <template v-if="canManageUsers">
                <label>Compte validé</label>
                <v-btn-toggle
                  v-model="filters.isVolunteer"
                  tile
                  color="deep-purple accent-3"
                  group
                  :disabled="isStatsModeActive"
                >
                  <v-btn :value="true" small :disabled="isStatsModeActive">
                    oui
                  </v-btn>
                  <v-btn :value="false" small :disabled="isStatsModeActive">
                    Non
                  </v-btn>
                </v-btn-toggle>
              </template>
            </v-card-text>
          </v-card>
          <v-card v-if="canManageUsers">
            <v-card-title>Mode stats humains</v-card-title>
            <v-card-text style="display: flex; flex-direction: column">
              <label>Mode stats</label>
              <v-btn-toggle
                v-model="isStatsModeActive"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-btn :value="true" small> oui</v-btn>
                <v-btn :value="false" small> Non</v-btn>
              </v-btn-toggle>
            </v-card-text>
            <v-card-actions class="ctas">
              <v-btn text @click="exportCSV"> exporter bénévoles </v-btn>
              <v-btn text :loading="planningLoading" @click="exportPlannings">
                télécharger plannings
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col md="10">
          <div>
            <v-data-table
              v-if="!isStatsModeActive"
              style="max-height: 100%; overflow-y: auto"
              :headers="headers"
              :items="displayedUsers"
              class="elevation-1"
              :items-per-page="20"
              dense
            >
              <template #item.name="{ item }">
                {{ formatUserName(item) }}
              </template>

              <template #item.actions="{ item }" style="display: flex">
                <v-btn icon small @click="openInformationDialog(item)">
                  <v-icon small>mdi-information-outline</v-icon>
                </v-btn>

                <v-btn icon small :href="getPhoneLink(item.phone)">
                  <v-icon small>mdi-phone</v-icon>
                </v-btn>

                <v-btn icon small :href="'mailto:' + item.email">
                  <v-icon small>mdi-email</v-icon>
                </v-btn>

                <v-btn icon small @click="openCalendar(item.id)">
                  <v-icon small>mdi-calendar</v-icon>
                </v-btn>
              </template>

              <template #item.charisma="{ item }">
                {{ item.charisma || 0 }}
              </template>

              <template #item.teams="{ item }">
                <v-container>
                  <TeamChip
                    v-for="team of item.teams"
                    :key="team"
                    :team="team"
                    with-name
                  ></TeamChip>
                </v-container>
              </template>

              <template #no-data> Aucun bénévole trouvé </template>
            </v-data-table>
            <VolunteerStatsTable v-else />
          </div>
        </v-col>
      </v-row>
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
    isVolunteer: boolean;
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
      { text: "Charisme", value: "charisma", align: "end" },
      { text: "Actions", value: "actions", sortable: false },
    ],

    filters: {
      search: "",
      teams: [],
      isVolunteer: true,
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
      return this.filters.isVolunteer
        ? this.$accessor.user.volunteers
        : this.$accessor.user.candidates;
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
        "Prénom;Nom;Surnom;Charisme;Roles;Email;Date de naissance;Téléphone;Commentaire";

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
p {
  margin: 0;
}

.v-btn-toggle--group > .v-btn.v-btn {
  margin: 0;
}

.container {
  padding: 0;
}

.ctas {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
