<template>
  <div>
    <h1>Fiches Activités</h1>

    <div class="custom_container">
      <v-container class="sidebar">
        <v-card>
          <v-card-title>Filtres</v-card-title>
          <v-card-text>
            <v-text-field v-model="search" label="Recherche" dense>
            </v-text-field>

            <SearchTeam
              v-model="selectedTeam"
              label="Équipe"
              :boxed="false"
            ></SearchTeam>

            <v-list dense shaped>
              <v-list-item-group v-model="selectedStatus">
                <v-list-item :value="''">
                  <v-list-item-title class="small">Tous</v-list-item-title>
                </v-list-item>
                <v-list-item :value="'DRAFT'">
                  <v-list-item-title class="small">Brouillon</v-list-item-title>
                </v-list-item>
                <v-list-item :value="'SUBMITTED'">
                  <v-list-item-title class="small">Soumise</v-list-item-title>
                </v-list-item>
                <v-list-item :value="'REFUSED'">
                  <v-list-item-title class="small">Refusée </v-list-item-title>
                </v-list-item>
                <v-list-item :value="'VALIDATED'">
                  <v-list-item-title class="small">Validée </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-for="validator of validators" :key="validator.id">
              <v-btn-toggle
                v-model="filter[validator.id]"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-icon small>{{ validator.icon }}</v-icon>
                <v-btn x-small :value="true" class="btn-check">validée </v-btn>
                <v-btn x-small :value="false" class="btn-check">refusée </v-btn>
                <v-btn x-small :value="2" class="btn-check">à valider </v-btn>
              </v-btn-toggle>
            </div>
            <v-switch
              v-if="isAdmin"
              v-model="isDeletedFilter"
              label="Afficher les FA supprimées"
            ></v-switch>
            <v-btn v-if="isSecu" @click="exportCSV()">Export sécu</v-btn>
          </v-card-text>
        </v-card>
      </v-container>

      <v-card class="data-table">
        <v-data-table
          :headers="headers"
          :items="selectedFAs"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1"
        >
          <template #[`item.validation`]="{ item }">
            <v-chip-group>
              <v-chip
                v-for="(validator, i) of validators"
                :key="i"
                small
                :color="getValidatorColor(item, validator)"
              >
                <v-icon small>
                  {{ validator.icon }}
                </v-icon>
              </v-chip>
            </v-chip-group>
          </template>
          <template #[`item.name`]="{ item }">
            <nuxt-link
              :to="`/fa/${item.id}`"
              :style="
                item.is_deleted === true
                  ? `text-decoration:line-through;`
                  : `text-decoration:none;`
              "
              >{{ item.name ? item.name : "" }}
            </nuxt-link>
          </template>
          <template #[`item.Team`]="{ item }">
            {{ item.Team ? item.Team.name : "" }}
          </template>
          <template #[`item.user_in_charge`]="{ item }">
            {{
              item.user_in_charge
                ? item.user_in_charge.firstname +
                  " " +
                  item.user_in_charge.lastname
                : ""
            }}
          </template>
          <template #[`item.action`]="{ item }">
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

          <template #[`item.status`]="row">
            <v-chip v-if="row.item" :color="color[row.item.status]" small
              >{{ row.item.id }}
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-dialog v-model="isNewFADialogOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter une nouvelle FA</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="faName"
            label="Nom de la FA"
            @keydown.enter="createNewFA"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="createNewFA">créer la FA</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDeleteFAOpen" max-width="600">
      <v-card>
        <v-card-title>Supprimer une FA</v-card-title>
        <v-card-text> Voulez-vous vraiment supprimer cette FA ?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteFA">supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-btn
      elevation="2"
      fab
      class="btn-plus"
      color="primary"
      small
      @click="isNewFADialogOpen = true"
    >
      <v-icon small>mdi-plus-thick</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import SearchTeam from "~/components/atoms/SearchTeam.vue";
import { Status } from "~/utils/models/FA";

export default {
  name: "Fa",
  components: { SearchTeam },
  data() {
    return {
      mFA: null,
      search: undefined,
      filter: {},
      isDeletedFilter: false,
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      selectedStatus: "",
      selectedTeam: undefined,
      headers: [
        { text: "Statut", value: "status" },
        { text: "Validation", value: "validation" },
        { text: "Nom", value: "name" },
        { text: "Equipe", value: "Team" },
        { text: "Resp", value: "user_in_charge" },
        { text: "Action", value: "action", sortable: false },
      ],
      color: {
        SUBMITTED: "warning",
        VALIDATED: "green",
        REFUSED: "red",
        DRAFT: "grey",
        undefined: "grey",
      },
      isNewFADialogOpen: false,
      isDeleteFAOpen: false,
      faName: undefined,
      teamNames: this.$accessor.team.teamNames,
    };
  },
  computed: {
    FAs() {
      return this.$accessor.FA.FAs;
    },
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    isAdmin() {
      return this.$accessor.user.hasPermission("admin");
    },
    isSecu() {
      return this.$accessor.user.hasPermission("manage-pass-secu");
    },
    selectedFAs() {
      let mFAs = this.filterBySelectedTeam(this.FAs, this.selectedTeam);
      mFAs = this.filterByValidatorStatus(mFAs);
      const options = {
        // Search in `author` and in `tags` array
        keys: ["name", "description"],
      };
      const fuse = new Fuse(mFAs, options);
      if (this.search === undefined || this.search === "") {
        return mFAs;
      }
      return fuse.search(this.search).map((e) => e.item);
    },
    validators() {
      return this.$accessor.team.faValidators;
    },
  },
  watch: {
    async selectedStatus() {
      await this.fetchFas();
    },
    async isDeletedFilter() {
      await this.fetchFas();
    },
  },
  async mounted() {
    if (!this.$accessor.user.hasPermission("hard")) {
      await this.$router.push({
        path: "/",
      });
    }

    this.fetchFas();
    if (this.validators.length === 0) {
      await this.$accessor.team.fetchFaValidators();
    }
  },
  methods: {
    async fetchFas() {
      const status =
        this.selectedStatus === "" ? undefined : this.selectedStatus;
      const search = { isDeleted: this.isDeletedFilter, status };
      await this.$accessor.FA.fetchFAs(search);
    },
    preDelete(fa) {
      this.mFA = fa;
      this.isDeleteFAOpen = true;
    },
    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
    filterBySelectedTeam(FAs, team) {
      if (!team) {
        return FAs;
      }
      return FAs.filter((FA) => FA.team_id === team.id);
    },
    filterByDeletedStatus(FAs) {
      if (this.isDeletedFilter === false) {
        return FAs.filter((FA) => FA.isValid !== false);
      }
      return FAs.filter((FA) => FA.isValid === false);
    },
    filterByValidatorStatus(FAs) {
      const filter = this.filter;
      Object.entries(filter).forEach(([validatorId, value]) => {
        FAs = FAs.filter((FA) => {
          if (value === true) {
            return this.isAnimationValidatedBy(FA, validatorId);
          }
          if (value === false) {
            return this.isAnimationRefusedBy(FA, validatorId);
          }
          if (value === 2) {
            return (
              !this.isAnimationValidatedBy(FA, validatorId) &&
              FA.status === Status.SUBMITTED
            );
          }
          return true;
        });
      });
      return FAs;
    },
    filterByStatus(FAs, status) {
      if (status === 0) {
        return FAs;
      }
      const s = ["", "DRAFT", "SUBMITTED", "REFUSED", "VALIDATED"];
      FAs = FAs.map((FA) => {
        if (FA) {
          if (FA.status === undefined) {
            FA.status = "DRAFT";
          }
        }
        return FA;
      });
      return FAs.filter((FA) => FA?.status === s.at(status));
    },
    isAnimationValidatedBy(FA, validatorId) {
      return FA.fa_validation.some(
        (validation) => validation.Team.id === parseInt(validatorId)
      );
    },
    isAnimationRefusedBy(FA, validatorId) {
      return FA.fa_refuse?.some(
        (refuse) => refuse.Team.id === parseInt(validatorId)
      );
    },
    async createNewFA() {
      if (!this.faName) return;
      const FA = {
        name: this.faName,
      };
      await this.$accessor.FA.createFa(FA);
      const savedFA = this.$accessor.FA.mFA;
      if (savedFA.id) {
        await this.$router.push({ path: "fa/" + savedFA.id });
      }
    },
    async deleteFA() {
      await this.$accessor.FA.deleteFA(this.mFA.id);
      this.isDeleteFAOpen = false;
      this.mFA = undefined;
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    getValidatorColor(fa, validator) {
      let color = "grey";
      if (fa.fa_validation) {
        fa.fa_validation.forEach((validation) => {
          if (Number(validation.Team.id) === Number(validator.id)) {
            color = "green";
          }
        });
      }
      if (fa.fa_refuse) {
        fa.fa_refuse.forEach((validation) => {
          if (Number(validation.Team.id) === Number(validator.id)) {
            color = "red";
          }
        });
      }
      return color;
    },
    download(filename, text) {
      // We use the 'a' HTML element to incorporate file generation into
      // the browser rather than server-side
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    async exportCSV() {
      // Parse data into a CSV string to be passed to the download function
      const csvHeader = "Numero;Nom;Resp;Nombre_de_passe;";
      const csvRows = this.selectedFAs.map((fa) => {
        const rowData = [
          fa.id,
          fa.name,
          fa.user_in_charge.firstname + " " + fa.user_in_charge.lastname,
          fa.number_of_pass,
        ];
        return `${rowData.join(";")}`;
      });
      const csv = [csvHeader, ...csvRows].join("\n");
      const regex = new RegExp(/undefined/i, "g");
      const parsedCSV = csv.replace(regex, "");
      this.download("passsecu.csv", parsedCSV);
    },
  },
};
</script>

<style scoped>
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
