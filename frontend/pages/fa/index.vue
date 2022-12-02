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

            <v-select
              v-model="selectedTeam"
              label="Équipe"
              :items="teamNames"
              clearable
              dense
            ></v-select>

            <v-list dense shaped>
              <v-list-item-group v-model="selectedStatus">
                <v-list-item>
                  <v-list-item-title class="small">Tous</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="small">Brouillon</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="small">Soumise</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="small">Refusée </v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title class="small">Validée </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <div v-for="validator of validators" :key="validator.id">
              <v-btn-toggle
                v-model="filter[validator]"
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
            <ValidatorsIcons :form="item"></ValidatorsIcons>
          </template>
          <template #[`item.name`]="{ item }">
            <a
              :href="`/fa/${item.id}`"
              :style="
                item.is_deleted === true
                  ? `text-decoration:line-through;`
                  : `text-decoration:none;`
              "
              >{{ item.name ? item.name : "" }}</a
            >
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
          <template #[`item.action`]="row">
            <tr>
              <td>
                <v-btn class="mx-2" icon small :href="`/fa/${row.item.id}`">
                  <v-icon small>mdi-circle-edit-outline</v-icon>
                </v-btn>
                <v-btn class="mx-2" icon small @click="preDelete(row.item)">
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
import { safeCall } from "../../utils/api/calls";
import { RepoFactory } from "../../repositories/repoFactory";
import ValidatorsIcons from "~/components/atoms/ValidatorsIcons.vue";

export default {
  name: "Fa",
  components: { ValidatorsIcons },
  data() {
    return {
      FAs: [],
      mFA: null,
      search: undefined,
      filter: {},
      isDeletedFilter: false, // true if deleted FAs are displayed
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      selectedStatus: 0,
      selectedTeam: undefined,
      headers: [
        { text: "Statut", value: "status" },
        { text: "Validation", value: "validator" },
        { text: "Nom", value: "name" },
        { text: "Equipe", value: "Team" },
        { text: "Resp", value: "user_in_charge" },
        { text: "Action", value: "action" },
      ],
      color: {
        envoyé: "warning",
        validé: "green",
        refusé: "red",
        brouillon: "grey",
        undefined: "grey",
      },

      isNewFADialogOpen: false,
      isDeleteFAOpen: false,
      faName: undefined,
      teamNames: this.$accessor.team.teamNames,
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    validators() {
      return this.$accessor.team.faValidators;
    },
    isAdmin() {
      return this.$accessor.user.hasRole("admin");
    },
    selectedFAs() {
      let mFAs = this.filterByStatus(this.FAs, this.selectedStatus);
      mFAs = this.filterByDeletedStatus(mFAs);
      mFAs = this.filterBySelectedTeam(mFAs, this.selectedTeam);
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
  },
  async mounted() {
    if (this.$accessor.user.hasRole("hard")) {
      // get FAs
      const res = await safeCall(
        this.$store,
        RepoFactory.faRepo.getAllFAs(this)
      );
      if (res) {
        this.FAs = res.data;
      } else {
        alert("error");
      }
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
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
      return FAs.filter((FA) => {
        if (FA.general && FA.general.team) {
          return FA.general.team === team;
        } else {
          return false;
        }
      });
    },

    filterByDeletedStatus(FAs) {
      if (this.isDeletedFilter === false) {
        return FAs.filter((FA) => FA.isValid !== false);
      }
      return FAs.filter((FA) => FA.isValid === false);
    },

    filterByValidatorStatus(FAs) {
      const filter = this.filter;
      Object.entries(filter).forEach(([validator, value]) => {
        FAs = FAs.filter((FA) => {
          if (value === true) {
            return FA.validated.includes(validator);
          } else if (value === false) {
            return FA.refused.includes(validator);
          } else if (value === 2) {
            return (
              !FA.validated.includes(validator) && FA.status === "SUBMITTED"
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
      return FAs.filter((FA) => FA?.status === s[status]);
    },

    async createNewFA() {
      if (!this.faName) {
        return;
      }
      const FA = {
        name: this.faName,
      };
      const res = await safeCall(
        this.$store,
        RepoFactory.faRepo.createNewFA(this, FA),
        "FA créée 🥳"
      );

      if (res) {
        await this.$router.push({ path: "fa/" + res.id });
      }
    },
    async deleteFA() {
      const res = await safeCall(
        this.$store,
        RepoFactory.faRepo.deleteFA(this, this.mFA),
        "FA supprimée 🥳",
        "FA non supprimée 😢"
      );
      if (res) {
        this.FAs = this.FAs.filter((e) => e.id !== this.mFA.id);
        this.isDeleteFAOpen = false;
        this.mFA = undefined;
      }
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
  },
};
</script>

<style scoped>
h1 {
  margin-left: 12px;
}

.fab-right {
  position: sticky;
  right: 10px;
  bottom: 35px;
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
