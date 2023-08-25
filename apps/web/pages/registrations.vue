<template>
  <div>
    <h1>Nouvelles inscriptions</h1>
    <v-data-table
      v-model="selectedNewcomers"
      :headers="headers"
      :items="matchingSearchNewcomers"
      :items-per-page="30"
      show-select
      class="elevation-1"
    >
      <template #top>
        <v-text-field
          v-model="searchNewcomer"
          label="Rechercher un nouvel arrivant"
          class="search"
        ></v-text-field>
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
          <v-btn class="white--text" v-bind="attrs" color="blue" v-on="on">
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Header } from "~/utils/models/data-table.model";
import { IDefineANewcomer, JoinableTeam } from "@overbookd/registration";
import { formatLocalDate } from "~/utils/date/date.utils";
import { SlugifyService } from "@overbookd/slugify";

interface RegistrationsData {
  headers: Header[];
  searchNewcomer: string;
  selectedNewcomers: IDefineANewcomer[];
}

type SearchableNewcomer = IDefineANewcomer & { searchable: string };

export default Vue.extend({
  name: "Registrations",
  components: { TeamChip },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Nom", value: "lastName" },
      { text: "Prénom", value: "firstName" },
      { text: "Date d'inscription", value: "registeredAt" },
      { text: "Equipes", value: "teams", sortable: false },
    ],
    searchNewcomer: "",
    selectedNewcomers: [],
  }),
  computed: {
    searchableNewcomers(): SearchableNewcomer[] {
      return this.$accessor.registration.newcomers.map((newcomer) => ({
        ...newcomer,
        searchable: SlugifyService.apply(
          `${newcomer.firstName} ${newcomer.lastName}`,
        ),
      }));
    },
    matchingSearchNewcomers(): IDefineANewcomer[] {
      const search = SlugifyService.apply(this.searchNewcomer);
      return this.searchableNewcomers.filter(({ searchable }) => {
        return searchable.includes(search);
      });
    },
    joinableTeams(): JoinableTeam[] {
      return ["hard", "soft", "confiance"];
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
  },
});
</script>

<style lang="scss" scoped>
.search {
  margin: 0 20px;
}
</style>
