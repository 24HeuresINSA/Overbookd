<template>
  <div>
    <h1>Nouvelles inscriptions</h1>
    <RegistrationConfiguration class="registration-configuration" />
    <v-divider></v-divider>
    <v-data-table
      v-model="selectedNewcomers"
      :headers="headers"
      :items="filteredNewcomers"
      :items-per-page="30"
      show-select
      class="elevation-1 newcomer-listing"
    >
      <template #top>
        <div class="filters">
          <v-text-field
            v-model="searchNewcomer"
            label="Rechercher un nouvel arrivant"
            class="search"
          ></v-text-field>
          <v-btn
            class="ma-2"
            color="primary"
            :outlined="!last30DaysNewcomers"
            @click="toggleLast30DaysNewcomers"
          >
            Inscrits dans les 30 derniers jours
          </v-btn>
        </div>
      </template>

      <template #item.registeredAt="{ item }">
        {{ formatDate(item.registeredAt) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>

      <template #no-data> Aucun nouvel arrivant </template>
    </v-data-table>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <template #activator="{ attrs, on }">
          <v-btn
            class="white--text"
            v-bind="attrs"
            color="blue"
            :disabled="noNewcomerSelected"
            v-on="on"
          >
            Enrôler en tant que
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="teamCode of joinableTeams" :key="teamCode" link>
            <v-list-item-title
              color="green"
              @click="enrollNewcomersAsMemberOf(teamCode)"
              v-text="getTeamName(teamCode)"
            ></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Header } from "~/utils/models/data-table.model";
import { IDefineANewcomer, JoinableTeam } from "@overbookd/registration";
import { formatLocalDate } from "~/utils/date/date.utils";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import RegistrationConfiguration from "~/components/molecules/registration/RegistrationConfiguration.vue";
import { ONE_DAY_IN_MS } from "../../../libraries/period/src";

interface RegistrationsData {
  headers: Header[];
  last30DaysNewcomers: boolean;
  searchNewcomer: string;
  selectedNewcomers: IDefineANewcomer[];
}

type Filter = (newcomer: Searchable<IDefineANewcomer>) => boolean;

export default Vue.extend({
  name: "Registrations",
  components: {
    TeamChip,
    SnackNotificationContainer,
    RegistrationConfiguration,
  },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Nom", value: "lastName" },
      { text: "Prénom", value: "firstName" },
      { text: "Date d'inscription", value: "registeredAt" },
      { text: "Equipes", value: "teams", sortable: false },
    ],
    last30DaysNewcomers: true,
    searchNewcomer: "",
    selectedNewcomers: [],
  }),
  computed: {
    searchableNewcomers(): Searchable<IDefineANewcomer>[] {
      return this.$accessor.registration.newcomers.map((newcomer) => ({
        ...newcomer,
        searchable: SlugifyService.apply(
          `${newcomer.firstName} ${newcomer.lastName}`,
        ),
      }));
    },
    filteredNewcomers(): IDefineANewcomer[] {
      const search = SlugifyService.apply(this.searchNewcomer);
      const thirtyDaysAgo = Date.now() - 30 * ONE_DAY_IN_MS;
      return this.searchableNewcomers.filter((newcomer) => {
        return (
          this.isMatchingNameSearch(search)(newcomer) &&
          this.isMatchingRegistrationDateLimit(thirtyDaysAgo)(newcomer)
        );
      });
    },
    joinableTeams(): JoinableTeam[] {
      return ["hard", "soft", "confiance"];
    },
    noNewcomerSelected(): boolean {
      return this.selectedNewcomers.length === 0;
    },
  },
  mounted() {
    this.$accessor.registration.getNewcomers();
  },
  methods: {
    formatDate(date: Date): string {
      return formatLocalDate(date);
    },
    getTeamName(teamCode: string): string {
      return this.$accessor.team.getTeamByCode(teamCode).name;
    },
    enrollNewcomersAsMemberOf(team: JoinableTeam) {
      this.$accessor.registration.enrollNewcomers({
        team,
        newcomers: this.selectedNewcomers,
      });
      this.selectedNewcomers = [];
    },
    toggleLast30DaysNewcomers() {
      this.last30DaysNewcomers = !this.last30DaysNewcomers;
    },
    isMatchingNameSearch(search: string): Filter {
      return ({ searchable }: Searchable<IDefineANewcomer>) =>
        searchable.includes(search);
    },
    isMatchingRegistrationDateLimit(dateLimit: number): Filter {
      return ({ registeredAt }: IDefineANewcomer) => {
        if (!this.last30DaysNewcomers) return true;
        return registeredAt.getTime() > dateLimit;
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  gap: 20px;
  margin: 10px 20px;
}

.registration-configuration {
  margin: 10px 0;
}
</style>
