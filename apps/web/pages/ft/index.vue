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
              v-if="isAdmin"
              v-model="filters.isDeleted"
              label="FT supprimées"
            ></v-switch>
            <v-switch v-model="filters.myFTs" label="Mes FT"></v-switch>
            <v-switch
              v-if="canAffect"
              v-model="filters.myFTsToReview"
              label="Mes FT à valider"
            ></v-switch>
          </v-card-text>
        </v-card>
      </v-container>

      <v-card class="data-table">
        <!--<v-btn color="green" width="100%" href="ft/ft_420">FT 420 🍃</v-btn>-->
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

          <template #[`item.name`]="{ item }">
            <nuxt-link :to="`/ft/${item.id}`" :class="deletedFTTextClass">
              {{ item.name }}
            </nuxt-link>
          </template>

          <template #[`item.fa`]="{ item }">
            <v-chip v-if="item.fa" :to="`fa/${item.fa.id}`" small>
              {{ item.fa.id }} - {{ item.fa.name }}
            </v-chip>
          </template>

          <template #[`item.team`]="{ item }">
            {{ item.team?.name ?? "" }}
          </template>

          <template #[`item.userInCharge`]="{ item }">
            {{ displayUsername(item.userInCharge) }}
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
      <NewFtCard />
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
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import NewFtCard from "~/components/molecules/festivalEvent/creation/NewFtCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { getFTValidationStatus } from "~/utils/festivalEvent/ftUtils";
import { Header } from "~/utils/models/dataTable";
import {
  Ft,
  FtSearch,
  FtSimplified,
  FtStatus,
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/models/ft";
import { Team } from "~/utils/models/team";
import { MyUserInformation, User } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

interface Data {
  headers: Header[];
  selectedFT: Ft | undefined;
  isDeleteDialogOpen: boolean;
  isRestoreDialogOpen: boolean;
  isNewFTDialogOpen: boolean;
  loading: boolean;

  filters: {
    search: string;
    team: Team | undefined;
    myFTs: boolean;
    isDeleted: boolean;
    status: FtStatus | undefined;
    myFTsToReview: boolean;
  };
}

export default Vue.extend({
  name: "Ft",
  components: { SnackNotificationContainer, SearchTeam, NewFtCard },
  data(): Data {
    return {
      headers: [
        { text: "Statut", value: "status" },
        { text: "Validation", value: "validation" },
        { text: "Nom", value: "name" },
        { text: "FA", value: "fa" },
        { text: "Resp", value: "userInCharge" },
        { text: "Equipe", value: "team" },
        { text: "Action", value: "action", sortable: false },
      ],
      filters: {
        search: "",
        team: undefined,
        myFTs: false,
        status: undefined,
        isDeleted: false,
        myFTsToReview: false,
      },
      selectedFT: undefined,
      isRestoreDialogOpen: false,
      isDeleteDialogOpen: false,
      isNewFTDialogOpen: false,
      loading: true,
    };
  },

  head: () => ({
    title: "Fiches Tâches",
  }),

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    FTs(): FtSimplified[] {
      return this.$accessor.ft.FTs;
    },
    filteredFTs(): FtSimplified[] {
      const { search, team, myFTs, status, myFTsToReview } = this.filters;

      const res = this.fuzzyFindFT(search);
      return res.filter((ft) => {
        return (
          this.filterFTByTeam(team)(ft) &&
          this.filterFTByOwnership(myFTs)(ft) &&
          this.filterFTByStatus(status)(ft) &&
          this.filterFTByReviewer(myFTsToReview)(ft)
        );
      });
    },
    statuses(): [FtStatus, FtStatusLabel][] {
      return [...ftStatusLabels.entries()];
    },
    isAdmin(): boolean {
      return this.$accessor.user.can("admin");
    },
    canAffect(): boolean {
      return this.$accessor.user.can("affect-volunteer");
    },
    validators(): Team[] {
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
    await Promise.all([this.fetchFTs(), this.retrieveValidatorsIfNeeded()]);
    this.loading = false;
  },

  methods: {
    filterFTByTeam(teamSearched?: Team): (ft: FtSimplified) => boolean {
      return teamSearched
        ? (ft) => ft.team?.code === teamSearched.code
        : () => true;
    },

    filterFTByOwnership(searchMyFTs: boolean): (ft: FtSimplified) => boolean {
      return searchMyFTs
        ? (ft) => ft.userInCharge?.id === this.me.id
        : () => true;
    },

    filterFTByStatus(statusSearched?: FtStatus): (ft: FtSimplified) => boolean {
      return statusSearched ? (ft) => ft.status === statusSearched : () => true;
    },

    filterFTByReviewer(
      searchMyFTsToReview: boolean
    ): (ft: FtSimplified) => boolean {
      return searchMyFTsToReview
        ? (ft) => ft.reviewer?.id === this.me.id
        : () => true;
    },

    fuzzyFindFT(search?: string): FtSimplified[] {
      if (!search) return this.FTs;
      const fuse = new Fuse<FtSimplified>(this.FTs, {
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
      return this.$accessor.user.can(permission);
    },

    getFTStatus(status: FtStatus): string {
      return status.toLowerCase();
    },

    getValidatorStatus(ft: Ft, validator: Team) {
      return getFTValidationStatus(ft, validator.code).toLowerCase();
    },

    displayUsername(user: User | null): string {
      if (!user) return "";
      return formatUsername(user);
    },

    async fetchFTs() {
      const searchParams: FtSearch = {
        isDeleted: this.filters.isDeleted,
        status: this.filters.status,
      };
      await this.$accessor.ft.fetchFTs(searchParams);
    },

    preDeleteFT(ft: Ft) {
      this.selectedFT = ft;
      this.isDeleteDialogOpen = true;
    },

    async deleteFT() {
      if (!this.selectedFT) return;
      await this.$accessor.ft.deleteFT(this.selectedFT);
      this.isDeleteDialogOpen = false;
      this.selectedFT = undefined;
    },

    preRestoreFT(ft: Ft) {
      this.selectedFT = ft;
      this.isRestoreDialogOpen = true;
    },

    async restoreFT() {
      if (!this.selectedFT) return;
      await this.$accessor.ft.restoreFT(this.selectedFT);
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
    margin-bottom: 45px;
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
