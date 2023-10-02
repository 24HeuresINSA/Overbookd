<template>
  <v-card class="filters_volunteers">
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field v-model="search" label="Recherche" :disabled="disabled" />

      <SearchTeams
        v-model="teams"
        label="Équipe(s)"
        :boxed="false"
        :disabled="disabled"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";

interface VolunteeListFiltersData {
  search: string;
  teams: string[];
}

export default Vue.extend({
  name: "VolunteerListFilters",
  components: { SearchTeams },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (): VolunteeListFiltersData => ({
    search: "",
    teams: [],
  }),
  methods: {
    propagateSearch() {
      this.$emit("change:search", this.search);
    },
    propagateTeams() {
      this.$emit("change:teams", this.teams);
    },
  },
});
</script>
