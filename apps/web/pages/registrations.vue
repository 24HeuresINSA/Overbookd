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
          v-model="searchNewComer"
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
            Ajouter à une équipe
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="team of teamsToAdd" :key="team" link>
            <v-list-item-title
              color="green"
              @click="addTeamToSelectedNewcomers(team)"
              v-text="team.name"
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
import { IDefineANewcomer } from "@overbookd/registration";
import { formatLocalDate } from "~/utils/date/date.utils";
import { SlugifyService } from "@overbookd/slugify";
import { Team } from "~/utils/models/team.model";

interface RegistrationsData {
  headers: Header[];
  searchNewComer: string;
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
    searchNewComer: "",
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
      return this.searchableNewcomers.filter(({ searchable }) => {
        if (this.searchNewComer === undefined) return true;

        const search = SlugifyService.apply(this.searchNewComer);
        return searchable.includes(search);
      });
    },
    teamsToAdd(): Team[] {
      const teamsCode = ["hard", "soft"];
      return teamsCode.map((code) => this.$accessor.team.getTeamByCode(code));
    },
  },
  methods: {
    formatDate(date: Date): string {
      return formatLocalDate(date);
    },
    addTeamToSelectedNewcomers(team: Team) {
      this.$accessor.registration.addTeamToNewcomers({
        teamCode: team.code,
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
