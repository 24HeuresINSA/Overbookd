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
                  <v-list-item-title>Tous</v-list-item-title>
                </v-list-item>
                <v-list-item
                  v-for="status in statuses"
                  :key="status"
                  :value="status"
                >
                  <v-list-item-title>
                    {{ getStatusLabel(status) }}
                  </v-list-item-title>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-switch
              v-if="isAdmin"
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
            <v-chip-group id="status">
              <v-chip :color="getFTStatus(item.status)" small>
                {{ item.id }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #[`item.validation`]="{ item }">
            <v-chip-group id="validators">
              <v-chip
                v-for="(validator, i) of validators"
                :key="i"
                small
                :color="getValidatorStatus(item, validator)"
              >
                <v-icon small>
                  {{ validator.icon }}
                </v-icon>
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.name="{ item }">
            <a :href="`/ft/${item.id}`" :class="deletedFTTextClass">
              {{ item.name }}
            </a>
          </template>

          <template #[`item.FA`]="{ item }">
            <v-chip
              v-if="item.FA && item.FA > 0"
              :href="`fa/${item.FA.id}`"
              small
            >
              {{ item.FA.id }}
            </v-chip>
          </template>

          <template #[`item.team`]="{ item }">
            {{ item.team?.name ?? "" }}
          </template>

          <template #[`item.inCharge`]="{ item }">
            {{ displayUsername(item.inCharge) }}
          </template>

          <template #[`item.action`]="{ item }">
            <v-btn
              v-if="filters.isDeleted === false"
              icon
              @click="preDeleteFT(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn v-else icon @click="preRestoreFT(item)"
              ><v-icon>mdi-delete-restore</v-icon></v-btn
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
        <v-img src="/img/sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isRestoreDialogOpen" width="600">
      <v-card>
        <v-img src="/img/sure.jpeg"></v-img>
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
import { getFTValidationStatus } from "~/utils/festivalEvent/ftUtils";
import { Header } from "~/utils/models/Data";
import {
  FT,
  FTCreation,
  FTStatus,
  FTStatusLabel,
  SearchFT,
} from "~/utils/models/ft";
import { Team } from "~/utils/models/team";
import { User } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

interface Data {
  headers: Header[];
  selectedFT: FT | undefined;
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
      selectedFT: undefined,
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
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    FTs(): FT[] {
      return this.$accessor.FT.FTs;
    },
    filteredFTs(): FT[] {
      const { search, team, myFTs, status } = this.filters;

      const res = this.fuzzyFindFT(search);
      return res.filter((ft) => {
        return (
          this.filterFTByTeam(team)(ft) &&
          this.filterFTByOwnership(myFTs)(ft) &&
          this.filterFTByStatus(status)(ft)
        );
      });
    },
    statuses(): FTStatus[] {
      return Object.values(FTStatus);
    },
    isAdmin(): boolean {
      return this.$accessor.user.hasPermission("admin");
    },
    validators() {
      return this.$accessor.team.ftValidators;
    },
    deletedFTTextClass(): string {
      return this.filters.isDeleted ? "invalid-text" : "valid-text";
    },
  },

  watch: {
    async "filters.isDeleted"() {
      await this.fetchFTs();
    },
  },

  async mounted() {
    if (!this.hasPermission("hard")) {
      await this.$router.push({
        path: "/",
      });
      this.loading = false;
      return;
    }

    await Promise.all([this.fetchFTs(), this.retrieveValidatorsIfNeeded()]);
    this.loading = false;
  },

  methods: {
    filterFTByTeam(teamSearched?: Team): (ft: FT) => boolean {
      return teamSearched
        ? (ft: FT) => ft.team?.code === teamSearched.code
        : () => true;
    },

    filterFTByOwnership(searchMyFTs: boolean): (ft: FT) => boolean {
      return searchMyFTs
        ? (ft: FT) => ft.inCharge?.id === this.me.id
        : () => true;
    },

    filterFTByStatus(statusSearched?: FTStatus): (ft: FT) => boolean {
      return statusSearched
        ? (ft: FT) => ft.status === statusSearched
        : () => true;
    },

    fuzzyFindFT(search?: string): FT[] {
      if (!search) return this.FTs;
      const fuse = new Fuse(this.FTs, {
        keys: ["name", "id"],
        threshold: 0.2,
      });
      return fuse.search(search).map((e) => e.item);
    },

    async retrieveValidatorsIfNeeded(): Promise<void> {
      if (this.validators.length) return;
      return this.$accessor.team.fetchFtValidators();
    },

    hasPermission(permission: string) {
      return this.$accessor.user.hasPermission(permission);
    },

    getFTStatus(status: FTStatus): string {
      return status.toLowerCase();
    },

    getValidatorStatus(ft: FT, validator: Team) {
      return getFTValidationStatus(ft, validator.code).toLowerCase();
    },

    displayUsername(user: User | null): string {
      if (!user) return "";
      return formatUsername(user);
    },

    getStatusLabel(status: FTStatus): FTStatusLabel {
      return FTStatusLabel[status];
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
      if (!this.mFT?.id) return;
      this.$router.push({ path: `ft/${this.mFT.id}` });
    },

    preDeleteFT(ft: FT) {
      this.selectedFT = ft;
      this.isDeleteDialogOpen = true;
    },

    async deleteFT() {
      if (!this.selectedFT) return;
      await this.$accessor.FT.deleteFT(this.selectedFT);
      this.isDeleteDialogOpen = false;
      this.selectedFT = undefined;
    },

    preRestoreFT(ft: FT) {
      this.selectedFT = ft;
      this.isRestoreDialogOpen = true;
    },

    async restoreFT() {
      if (!this.selectedFT) return;
      await this.$accessor.FT.restoreFT(this.selectedFT);
      this.isRestoreDialogOpen = false;
      this.selectedFT = undefined;
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  margin-left: 12px;
}

.custom_container {
  display: flex;
  margin: 1%;

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
}

.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
}

@media only screen and (max-width: 800px) {
  .custom_container {
    flex-direction: column;

    .sidebar {
      width: 100%;
    }

    .data-table {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
