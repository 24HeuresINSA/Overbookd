<template>
  <v-card class="filters_volunteers">
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field
        :data="search"
        label="Recherche"
        :disabled="disabled"
        @input="propagateSearch"
      />

      <SearchTeams
        :teams="teams"
        label="Équipe(s)"
        :boxed="false"
        :disabled="disabled"
        @change="propagateTeams"
      />

      <SearchTeams
        :teams="excludedTeams"
        label="Équipe(s) à exclure"
        :boxed="false"
        :disabled="disabled"
        @change="propagateExcludedTeams"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { Team } from "@overbookd/http";

export default Vue.extend({
  name: "VolunteerListFilters",
  components: { SearchTeams },
  props: {
    search: {
      type: String,
      default: "",
    },
    teams: {
      type: Array as () => Team[],
      default: () => [],
    },
    excludedTeams: {
      type: Array as () => Team[],
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    propagateSearch(search: string) {
      this.$emit("change:search", search);
    },
    propagateTeams(teams: Team[]) {
      this.$emit("change:teams", teams);
    },
    propagateExcludedTeams(excludedTeams: Team[]) {
      this.$emit("change:excluded-teams", excludedTeams);
    },
  },
});
</script>
