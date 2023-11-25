<template>
  <div class="fa">
    <h1>Fiches Activités</h1>

    <div class="custom-container">
      <v-container class="sidebar">
        <FestivalEventFilter
          :search="filters.search"
          :team="filters.team"
          :status="filters.status"
          @change:search="filters.search = $event"
          @change:team="filters.team = $event"
          @change:status="filters.status = $event"
        >
          <template #additional-filters>
            <div v-for="validator of validators" :key="validator.code">
              <v-btn-toggle
                tile
                color="deep-purple accent-3"
                group
                @change="changeValidatorStatusFilter(validator, $event)"
              >
                <v-icon small>{{ validator.icon }}</v-icon>
                <v-btn
                  v-for="[status, label] of validatorStatusLabels"
                  :key="status"
                  :value="status"
                  x-small
                  @click="changeValidatorStatusFilter(validator, status)"
                >
                  {{ label }}
                </v-btn>
              </v-btn-toggle>
            </div>

            <v-switch
              v-if="canViewDeletedFa"
              v-model="filters.isDeleted"
              label="Afficher les FA supprimées"
            ></v-switch>
            <v-btn v-if="canManageLocation" @click="exportCsvSigna()">
              Export signa
            </v-btn>
          </template>
        </FestivalEventFilter>
      </v-container>

      <v-card class="data-table">
        <v-data-table
          :headers="headers"
          :items="filteredFas"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1"
        >
          <template #item.status="{ item }">
            <v-chip-group>
              <v-chip :color="getFaStatus(item.status)" small>
                {{ item.id }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.validation>
            <v-chip-group column>
              <v-chip
                v-for="validator of validators"
                :key="validator.code"
                small
              >
                <v-icon small>
                  {{ validator.icon }}
                </v-icon>
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.name="{ item }">
            <nuxt-link :to="`/fa/${item.id}`" :class="deletedFaTextClass">
              {{ item.name }}
            </nuxt-link>
          </template>

          <template #item.adherent="{ item }">
            {{ formatUsername(item.adherent) }}
          </template>

          <template #item.team="{ item }">
            <TeamChip :team="item.team" with-name />
          </template>

          <template #item.action="{ item }">
            <tr>
              <td>
                <div v-if="!filters.isDeleted">
                  <v-btn icon small :to="`/fa/${item.id}`">
                    <v-icon small>mdi-circle-edit-outline</v-icon>
                  </v-btn>
                  <v-btn icon small @click="preDelete(item)">
                    <v-icon small>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
          </template>

          <template #no-data> Aucune FA trouvée </template>
        </v-data-table>
      </v-card>
    </div>

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="isNewFaDialogOpen = true"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewFaDialogOpen" max-width="600">
      <NewFaCard @close-dialog="isNewFaDialogOpen = false" />
    </v-dialog>

    <v-dialog v-model="isDeleteDialogOpen" width="600">
      <ConfirmationMessage
        @close-dialog="closeDeleteFaDialog"
        @confirm="deleteFa"
      >
        <template #title> Supprimer la FA </template>
        <template #statement>
          Es-tu sûr de vouloir supprimer la FA
          <strong>{{ selectedFa?.name }}</strong> ?
        </template>
      </ConfirmationMessage>
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import NewFaCard from "~/components/molecules/festival-event/creation/NewFaCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FestivalEventFilter from "~/components/molecules/festival-event/filter/FestivalEventFilter.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import {
  FaSimplified,
  FaStatus,
  FaStatusLabel,
  faStatusLabels,
  SearchFa,
  ValidatorStatus,
  ValidatorStatusLabel,
  validatorStatusLabels,
} from "~/utils/models/fa.model";
import { formatUsername } from "~/utils/user/user.utils";
import { Team } from "~/utils/models/team.model";
import { Header } from "~/utils/models/data-table.model";
import { Searchable } from "~/utils/search/search.utils";
import { SlugifyService } from "@overbookd/slugify";
import { MANAGE_LOCATION, VIEW_DELETED_FA } from "@overbookd/permission";
import { PreviewFestivalActivity } from "@overbookd/festival-activity";
import { User } from "@overbookd/user";

interface FaData {
  headers: Header[];
  selectedFa?: FaSimplified;
  isNewFaDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  validatorStatuses: Map<string, ValidatorStatus>;
  filters: {
    search: string;
    team?: Team;
    status?: FaStatus;
    isDeleted: boolean;
  };
}

export default Vue.extend({
  name: "Fa",
  components: {
    FestivalEventFilter,
    NewFaCard,
    TeamChip,
    ConfirmationMessage,
    SnackNotificationContainer,
  },
  data: (): FaData => ({
    headers: [
      { text: "Statut", value: "status", sortable: false },
      { text: "Validation", value: "validation", sortable: false },
      { text: "Nom", value: "name" },
      { text: "Equipe", value: "team" },
      { text: "Resp", value: "adherent", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ],
    selectedFa: undefined,
    isNewFaDialogOpen: false,
    isDeleteDialogOpen: false,
    validatorStatuses: new Map(),
    filters: {
      search: "",
      team: undefined,
      status: undefined,
      isDeleted: false,
    },
  }),
  head: () => ({
    title: "Fiches Activités",
  }),
  computed: {
    fas(): PreviewFestivalActivity[] {
      return this.$accessor.festivalActivity.allActivities;
    },
    validators(): Team[] {
      return this.$accessor.team.faValidators;
    },
    statuses(): [FaStatus, FaStatusLabel][] {
      return [...faStatusLabels.entries()];
    },
    searchableFas(): Searchable<PreviewFestivalActivity>[] {
      return this.fas.map((fa) => ({
        ...fa,
        searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
      }));
    },
    filteredFas(): PreviewFestivalActivity[] {
      const { team, status, search } = this.filters;

      return this.searchableFas.filter((fa) => {
        return (
          this.filterFaByTeam(team)(fa) &&
          this.filterFaByStatus(status)(fa) &&
          this.filterFaByNameAndId(search)(fa)
        );
      });
    },
    validatorStatusLabels(): [ValidatorStatus, ValidatorStatusLabel][] {
      return [...validatorStatusLabels.entries()];
    },
    deletedFaTextClass(): string {
      return this.filters.isDeleted ? "invalid-text" : "valid-text";
    },
    canViewDeletedFa(): boolean {
      return this.$accessor.user.can(VIEW_DELETED_FA);
    },

    canManageLocation(): boolean {
      return this.$accessor.user.can(MANAGE_LOCATION);
    },
  },

  watch: {
    async "filters.isDeleted"() {
      await this.fetchFas();
    },
  },

  async mounted() {
    await Promise.all([
      this.$accessor.team.fetchFaValidators(),
      this.$accessor.festivalActivity.fetchAllActivities(),
    ]);
  },

  methods: {
    filterFaByTeam(
      teamSearched?: Team,
    ): (fa: PreviewFestivalActivity) => boolean {
      return teamSearched ? (fa) => fa.team === teamSearched.code : () => true;
    },

    filterFaByStatus(
      statusSearched?: FaStatus,
    ): (fa: PreviewFestivalActivity) => boolean {
      return statusSearched ? (fa) => fa.status === statusSearched : () => true;
    },

    filterFaByNameAndId(
      search: string,
    ): (fa: Searchable<PreviewFestivalActivity>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },

    async fetchFas() {
      const searchParams: SearchFa = { isDeleted: this.filters.isDeleted };
      await this.$accessor.fa.fetchFAs(searchParams);
    },

    getFaStatus(status: FaStatus): string {
      return status.toLowerCase();
    },

    preDelete(fa: FaSimplified) {
      this.selectedFa = fa;
      this.isDeleteDialogOpen = true;
    },

    async deleteFa() {
      if (!this.selectedFa) return;
      await this.$accessor.fa.deleteFA(this.selectedFa.id);
      this.isDeleteDialogOpen = false;
      this.selectedFa = undefined;
    },

    closeDeleteFaDialog() {
      this.selectedFa = undefined;
      this.isDeleteDialogOpen = false;
    },

    /*async exportCsvSecu() {
      // Parse data into a CSV string to be passed to the download function
      const csvHeader = "Numero;Nom;Resp;Nombre_de_pass;";
      const csvRows = this.FAs.map((fa) => {
        const rowData = [
          fa.id,
          fa.name,
          fa.userInCharge ? formatUsername(fa.userInCharge) : "",
          fa.numberOfPass,
        ];
        return `${rowData.join(";")}`;
      });
      const csv = [csvHeader, ...csvRows].join("\n");
      const regex = new RegExp(/undefined/i, "g");
      const parsedCSV = csv.replace(regex, "");
      this.download("passsecu.csv", parsedCSV);
    },*/

    async exportCsvSigna() {
      const signaNeeds = await this.$accessor.fa.getSignaNeedsForCsv();
      if (!signaNeeds) return;
      const csvHeader =
        "Numéro FA;Nom FA;Type;Texte;Nombre;Taille;Commentaire;";
      const csvRows = signaNeeds.map((signaNeed) => {
        const rowData = [
          signaNeed.faId,
          signaNeed.faName,
          signaNeed.signaType,
          signaNeed.text,
          signaNeed.count,
          signaNeed.size,
          signaNeed.comment,
        ];
        return `${rowData.join(";")}`;
      });
      const csv = [csvHeader, ...csvRows].join("\n");
      const regex = new RegExp(/undefined/i, "g");
      const parsedCSV = csv.replace(regex, "");
      this.download("exportSigna.csv", parsedCSV);
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

    changeValidatorStatusFilter(team: Team, value: ValidatorStatus) {
      this.validatorStatuses.set(team.code, value);
    },

    formatUsername(user?: User): string {
      return user ? formatUsername(user) : "";
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 15px;
}

.custom-container {
  display: flex;
  margin: 1%;
}

.sidebar {
  padding: 0;
  width: fit-content;
}

.data-table {
  margin-left: 20px;
  height: fit-content;
  width: 100vw;

  .valid-text {
    text-decoration: none;
  }

  .invalid-text {
    text-decoration: line-through;
  }
}

.btn-check {
  padding: 0 2px;
}

.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
}

@media only screen and (max-width: 800px) {
  .custom-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .data-table {
    margin: 0;
    width: 100%;
  }
}
</style>
