<template>
  <div class="ft">
    <h1>Fiches Tâches</h1>

    <div class="custom_container">
      <v-container class="sidebar">
        <v-card>
          <v-card-title>Filtres</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="filters.search"
              label="Rechercher une FT"
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
              v-if="canViewDeletedFt"
              v-model="filters.isDeleted"
              label="FT supprimées"
            ></v-switch>
            <v-switch v-model="filters.myFTs" label="Mes FT"></v-switch>
          </v-card-text>
        </v-card>
      </v-container>

      <v-card class="data-table">
        <v-data-table
          :headers="headers"
          :items="filteredFts"
          :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
          class="elevation-1"
        >
          <template #item.status="{ item }">
            <v-chip-group id="status">
              <v-chip :color="getFtStatus(item.status)" small>
                {{ item.id }}
              </v-chip>
            </v-chip-group>
          </template>

          <template #item.validation="{ item }">
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
            <nuxt-link :to="`/ft/${item.id}`" :class="deletedFTTextClass">
              {{ item.name }}
            </nuxt-link>
          </template>

          <template #item.fa="{ item }">
            <v-chip v-if="item.fa" :to="`fa/${item.fa.id}`" small>
              {{ item.fa.id }} - {{ item.fa.name }}
            </v-chip>
          </template>

          <template #item.team="{ item }">
            {{ item.team?.name ?? "" }}
          </template>

          <template #item.userInCharge="{ item }">
            {{ displayUsername(item.userInCharge) }}
          </template>

          <template #item.action="{ item }">
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

          <template #no-data> Aucune FT trouvée </template>
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
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeam from "~/components/atoms/field/search/SearchTeam.vue";
import NewFtCard from "~/components/molecules/festival-event/creation/NewFtCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { SlugifyService } from "@overbookd/slugify";
import { getFTValidationStatus } from "~/utils/festival-event/festival-task/ft.utils";
import { Header } from "~/utils/models/data-table.model";
import {
  Ft,
  FtStatus,
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/models/ft.model";
import { Team } from "~/utils/models/team.model";
import { MyUserInformation, User } from "@overbookd/user";
import { formatUsername } from "~/utils/user/user.utils";
import { Searchable } from "~/utils/search/search.utils";
import { AFFECT_VOLUNTEER, VIEW_DELETED_FT } from "@overbookd/permission";
import { FestivalTask, PreviewFestivalTask } from "@overbookd/festival-event";

interface Data {
  headers: Header[];
  selectedFT?: Ft;
  isDeleteDialogOpen: boolean;
  isRestoreDialogOpen: boolean;
  isNewFTDialogOpen: boolean;

  filters: {
    search: string;
    team?: Team;
    myFTs: boolean;
    isDeleted: boolean;
    status?: FestivalTask["status"];
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
      },
      selectedFT: undefined,
      isRestoreDialogOpen: false,
      isDeleteDialogOpen: false,
      isNewFTDialogOpen: false,
    };
  },

  head: () => ({
    title: "Fiches Tâches",
  }),

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    tasks(): PreviewFestivalTask[] {
      return this.$accessor.festivalTask.tasks.forAll;
    },
    searchableFts(): Searchable<PreviewFestivalTask>[] {
      return this.tasks.map((ft) => ({
        ...ft,
        searchable: SlugifyService.apply(`${ft.id} ${ft.name}`),
      }));
    },
    filteredFts(): PreviewFestivalTask[] {
      const { search, team, myFTs, status } = this.filters;

      return this.searchableFts.filter((ft) => {
        return (
          this.filterFtByTeam(team)(ft) &&
          this.filterFtByOwnership(myFTs)(ft) &&
          this.filterFtByStatus(status)(ft) &&
          this.filterFtByName(search)(ft)
        );
      });
    },
    statuses(): [FtStatus, FtStatusLabel][] {
      return [...ftStatusLabels.entries()];
    },
    canViewDeletedFt(): boolean {
      return this.$accessor.user.can(VIEW_DELETED_FT);
    },
    canAffect(): boolean {
      return this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
    validators(): Team[] {
      return this.$accessor.team.ftValidators;
    },
    deletedFTTextClass(): string {
      return this.filters.isDeleted ? "invalid-text" : "valid-text";
    },
  },

  async mounted() {
    await Promise.all([
      this.$accessor.team.fetchFtValidators(),
      this.$accessor.festivalTask.fetchAllTasks(),
      this.$accessor.user.fetchAdherents(),
    ]);
  },

  methods: {
    filterFtByTeam(teamSearched?: Team): (ft: PreviewFestivalTask) => boolean {
      return teamSearched ? (ft) => ft.team === teamSearched.code : () => true;
    },

    filterFtByOwnership(
      searchMyFts: boolean,
    ): (ft: PreviewFestivalTask) => boolean {
      return searchMyFts
        ? (ft) => ft.administrator.id === this.me.id
        : () => true;
    },

    filterFtByStatus(
      statusSearched?: FestivalTask["status"],
    ): (ft: PreviewFestivalTask) => boolean {
      return statusSearched ? (ft) => ft.status === statusSearched : () => true;
    },

    filterFtByName(
      search: string,
    ): (ft: Searchable<PreviewFestivalTask>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },

    getFtStatus(status: FtStatus): string {
      return status.toLowerCase();
    },

    getValidatorStatus(ft: Ft, validator: Team) {
      return getFTValidationStatus(ft, validator.code).toLowerCase();
    },

    displayUsername(user: User | null): string {
      if (!user) return "";
      return formatUsername(user);
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
