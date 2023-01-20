<template>
  <div class="ft">
    <h1>Fiche Tâche</h1>

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
                <v-list-item value="">
                  <v-list-item-title class="small">Tous</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-for="item in statusData"
                  :key="item.status"
                  :value="item.status"
                >
                  <v-list-item-title class="small">
                    {{ item.label }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-switch
              v-model="filters.isDeleted"
              label="FT supprimées"
            ></v-switch>
            <v-switch v-model="filters.myFTs" label="Mes FTs"></v-switch>
          </v-card-text>
        </v-card>
      </v-container>

      <v-card class="data-table">
        <v-btn color="green" width="100%" href="ft/ft_420">FT 420 🍃</v-btn>
        <v-data-table
          :headers="headers"
          :items="filteredFTs"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1"
        >
          <template #[`item.status`]="{ item }">
            <v-chip :color="getColorByStatus(item.status)" small>
              <span class="chip-text">{{ item.id }}</span>
            </v-chip>
          </template>
          <template #item.name="{ item }">
            <a
              :href="`/ft/${item.id}`"
              :style="
                item.isValid === false
                  ? `text-decoration:line-through;`
                  : `text-decoration:none;`
              "
              >{{ item.name ?? "" }}</a
            >
          </template>
          <template #[`item.FA`]="{ item }">
            <v-chip v-if="item.FA && item.FA > 0" small>
              {{ item.FA }}
            </v-chip>
          </template>
          <template #item.validation="{ item }">
            <!-- TODO implement the validator icons -->
          </template>
          <template #[`item.action`]="{ item }">
            <v-btn
              v-if="item.isDeleted !== true"
              icon
              small
              @click="preDeleteFT(item)"
            >
              <v-icon small>mdi-delete</v-icon>
            </v-btn>
            <v-btn v-else-if="isAdmin" icon small @click="preRestoreFT(item)"
              ><v-icon small>mdi-delete-restore</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-card>
    </div>

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="isNewFTDialogOpen = true"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewFTDialogOpen" width="600">
      <v-card>
        <v-card-title>Ajouter une nouvelle FT</v-card-title>
        <v-card-text>
          <v-text-field v-model="FTName" label="Nom de la FT"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!FTName" @click="createNewFT">Créer la FT</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isDeleteDialogOpen" width="600">
      <v-card>
        <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isRestoreDialogOpen" width="600">
      <v-card>
        <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="restoreFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>

  <!-- snack bar -->
</template>

<script lang="ts">
import Fuse from "fuse.js";
import Vue from "vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { Header } from "~/utils/models/Data";
import {
  FT,
  FTCreation,
  FTStatus,
  FTStatusColor,
  FTStatusData,
  FTStatusLabel,
  SearchFT,
} from "~/utils/models/ft";
import { Team } from "~/utils/models/team";

interface Data {
  headers: Header[];
  mFT: FT | undefined;
  isDeleteDialogOpen: boolean;
  isRestoreDialogOpen: boolean;
  isNewFTDialogOpen: boolean;
  FTName: string;
  loading: boolean;

  filters: {
    search: string;
    team: Team | undefined;
    myFTs: boolean;
    isDeleted: boolean;
    status: FTStatus | undefined;
  };
}

export default Vue.extend({
  name: "Index",
  components: { SnackNotificationContainer, SearchTeam },
  data(): Data {
    return {
      headers: [
        { text: "Statut", value: "status" },
        { text: "Validation", value: "validation" },
        { text: "Nom", value: "name" },
        { text: "FA", value: "FA" },
        { text: "Resp", value: "inCharge" },
        { text: "Equipe", value: "team" },
        { text: "Action", value: "action" },
      ],
      FTName: "",
      filters: {
        search: "",
        team: undefined,
        myFTs: false,
        status: undefined,
        isDeleted: false,
      },
      mFT: undefined,
      isRestoreDialogOpen: false,
      isDeleteDialogOpen: false,
      isNewFTDialogOpen: false,
      loading: true,
    };
  },

  computed: {
    me(): any {
      return this.$accessor.user.me;
    },
    FTs(): FT[] {
      return this.$accessor.FT.FTs;
    },
    filteredFTs(): FT[] {
      let res = this.FTs;
      const { search, team, myFTs, status } = this.filters;

      if (team) {
        res = res.filter((ft) => {
          if (!ft.team) return false;
          return ft.team.id === team.id;
        });
      }
      if (myFTs) {
        res = res.filter((ft) => {
          if (!ft.inCharge) return false;
          return ft.inCharge.id === this.me.id;
        });
      }
      const fuse = new Fuse(res, {
        keys: ["name", "id"],
        threshold: 0.2,
      });
      if (search) {
        res = fuse.search(search).map((e) => e.item);
      }
      if (status) {
        res = res.filter((e) => e.status === status);
      }
      return res;
    },
    statusData(): FTStatusData[] {
      return Object.keys(FTStatusColor).map((key) => {
        return {
          status: key as FTStatus,
          label: FTStatusLabel[key as FTStatus],
          color: FTStatusColor[key as FTStatus],
        };
      });
    },
    isAdmin(): boolean {
      return this.$accessor.user.hasPermission("admin");
    },
  },

  watch: {
    async "filters.isDeleted"() {
      await this.fetchFTs();
    },
  },

  async mounted() {
    if (this.hasPermission("hard")) {
      await this.fetchFTs();
    } else {
      await this.$router.push({
        path: "/",
      });
    }
    this.loading = false;
  },

  methods: {
    hasPermission(permission: string) {
      return this.$accessor.user.hasPermission(permission);
    },

    getColorByStatus(status: FTStatus): string {
      return this.statusData.find((e) => e.status === status)?.color || "grey";
    },

    async fetchFTs() {
      const searchParams: SearchFT = {
        isDeleted: this.filters.isDeleted,
        status: this.filters.status,
      };
      await this.$accessor.FT.fetchFTs(searchParams);
    },

    async createNewFT() {
      if (!this.FTName) return;
      const blankFT: FTCreation = {
        name: this.FTName,
      };
      await this.$accessor.FT.createFT(blankFT);
      const savedFT = this.$accessor.FT.mFT;
      if (savedFT.id) await this.$router.push({ path: "ft/" + savedFT.id });
    },

    preDeleteFT(ft: FT) {
      this.mFT = ft;
      this.isDeleteDialogOpen = true;
    },

    async deleteFT() {
      if (!this.mFT) return;
      await this.$accessor.FT.deleteFT(this.mFT);
      this.isDeleteDialogOpen = false;
      this.mFT = undefined;
    },

    preRestoreFT(ft: FT) {
      this.mFT = ft;
      this.isRestoreDialogOpen = true;
    },

    async restoreFT() {
      if (!this.mFT) return;
      await this.$accessor.FT.restoreFT(this.mFT);
      this.isRestoreDialogOpen = false;
      this.mFT = undefined;
    },
  },
});
</script>

<style scoped>
h1 {
  margin-left: 12px;
}

.small {
  font-size: small;
  margin-left: 0;
}

.chip-text {
  font-weight: bold;
  color: white;
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
