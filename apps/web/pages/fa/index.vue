<template>
  <div class="fa">
    <h1>Fiches Activités</h1>

    <div class="custom_container">
      <v-container class="sidebar">
        <v-card>
          <v-card-title>Filtres</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="filters.search"
              label="Recherche"
            ></v-text-field>
            <SearchTeam
              v-model="filters.team"
              label="Équipe"
              :boxed="false"
            ></SearchTeam>

            <h3>Statut</h3>
            <v-list dense shaped>
              <v-list-item-group v-model="filters.status">
                <v-list-item :value="null">
                  <v-list-item-title>Tous</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-for="[status, label] in statuses"
                  :key="status"
                  :value="status"
                >
                  <v-list-item-title>
                    {{ label }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-switch
              v-if="canViewDeletedFa"
              v-model="filters.isDeleted"
              label="Afficher les FA supprimées"
            ></v-switch>
            <!--<v-btn v-if="isSecu" @click="exportCsvSecu()">Export sécu</v-btn>
            <v-btn v-if="isSigna" @click="exportCsvSigna()">Export signa</v-btn>-->
          </v-card-text>
        </v-card>
      </v-container>

      <v-card class="data-table">
        <v-data-table
          :headers="headers"
          :items="filteredFas"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1"
        >
          <template #item.status="{ item }">
            <v-chip-group id="status">
              <v-chip :color="getFaStatus(item.status)" small>
                {{ item.id }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.name="{ item }">
            <nuxt-link
              :to="`/fa/${item.id}`"
              :style="
                item.isDeleted === true
                  ? `text-decoration:line-through;`
                  : `text-decoration:none;`
              "
              >{{ item.name }}
            </nuxt-link>
          </template>

          <template #item.team="{ item }">
            {{ item?.team?.name }}
          </template>

          <template #item.userInCharge="{ item }">
            {{ item.userInCharge ? formatUsername(item.userInCharge) : "" }}
          </template>

          <template #item.action="{ item }">
            <tr>
              <td>
                <v-btn class="mx-2" icon small :to="`/fa/${item.id}`">
                  <v-icon small>mdi-circle-edit-outline</v-icon>
                </v-btn>
                <v-btn class="mx-2" icon small @click="preDelete(item)">
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
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
      <NewFaCard />
    </v-dialog>

    <v-dialog v-model="isDeleteDialogOpen" width="600">
      <v-card>
        <v-img src="/img/sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFa()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import NewFaCard from "~/components/molecules/festival-event/creation/NewFaCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import {
  Fa,
  FaSimplified,
  FaStatus,
  FaStatusLabel,
  faStatusLabels,
  SearchFa,
} from "~/utils/models/fa.model";
import { formatUsername } from "~/utils/user/user.utils";
import { Team } from "~/utils/models/team.model";
import { User } from "@overbookd/user";
import { Header } from "~/utils/models/data-table.model";

interface FaData {
  headers: Header[];
  selectedFa?: Fa;
  isNewFaDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  filters: {
    search: string;
    team?: Team;
    status: FaStatus;
    isDeleted: boolean;
  };
}

export default Vue.extend({
  name: "Fa",
  components: { SearchTeam, NewFaCard, SnackNotificationContainer },
  data: (): FaData => ({
    headers: [
      { text: "Statut", value: "status", sortable: false },
      { text: "Validation", value: "validation", sortable: false },
      { text: "Nom", value: "name" },
      { text: "Equipe", value: "team" },
      { text: "Resp", value: "userInCharge" },
      { text: "Action", value: "action", sortable: false },
    ],
    selectedFa: undefined,
    isNewFaDialogOpen: false,
    isDeleteDialogOpen: false,
    filters: {
      search: "",
      team: undefined,
      status: FaStatus.DRAFT,
      isDeleted: false,
    },
  }),
  head: () => ({
    title: "Fiches Activités",
  }),
  computed: {
    FAs(): FaSimplified[] {
      return this.$accessor.fa.FAs;
    },
    canViewDeletedFa(): boolean {
      return this.$accessor.user.can("view-deleted-fa");
    },
    isSecu(): boolean {
      return this.$accessor.user.can("manage-pass-secu");
    },
    isSigna(): boolean {
      return this.$accessor.user.can("manage-location");
    },
    statuses(): [FaStatus, FaStatusLabel][] {
      return [...faStatusLabels.entries()];
    },
    filteredFas(): FaSimplified[] {
      return this.FAs;
    },
  },
  async mounted() {
    await this.fetchFas();
  },
  methods: {
    async fetchFas() {
      const searchParams: SearchFa = {
        isDeleted: this.filters.isDeleted,
        status: this.filters.status,
      };
      await this.$accessor.fa.fetchFAs(searchParams);
    },
    getFaStatus(status: FaStatus): string {
      return status.toLowerCase();
    },
    preDelete(fa: Fa) {
      this.selectedFa = fa;
      this.isDeleteDialogOpen = true;
    },
    async deleteFa() {
      if (!this.selectedFa) return;
      await this.$accessor.fa.deleteFA(this.selectedFa.id);
      this.isDeleteDialogOpen = false;
      this.selectedFa = undefined;
    },
    filterBySelectedTeam(FAs: FaSimplified[], team?: Team): FaSimplified[] {
      if (!team) return FAs;
      return FAs.filter((FA) => FA.team?.code === team.code);
    },
    /*download(filename: string, text: string) {
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
    async exportCsvSecu() {
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
    },
    async exportCsvSigna() {
      const signa_needs = await this.$accessor.fa.getSignaNeedsForCsv();
      const csvHeader = "Numero FA;Nom FA;Type;Texte;Nombre;Commentaire;";
      const csvRows = signa_needs.map((signa_need) => {
        const rowData = [
          signa_need.fa_id,
          signa_need.fa_name,
          signa_need.signa_type,
          signa_need.text,
          signa_need.count,
          signa_need.comment,
        ];
        return `${rowData.join(";")}`;
      });
      const csv = [csvHeader, ...csvRows].join("\n");
      const regex = new RegExp(/undefined/i, "g");
      const parsedCSV = csv.replace(regex, "");
      this.download("exportSigna.csv", parsedCSV);
    },*/
    formatUsername(user: User) {
      return formatUsername(user);
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 12px;
}

.small {
  font-size: small;
  margin-left: 0;
}

.custom_container {
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
}

.btn-check {
  padding-right: 2px;
  padding-left: 2px;
}

.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
}

@media only screen and (max-width: 800px) {
  .custom_container {
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
