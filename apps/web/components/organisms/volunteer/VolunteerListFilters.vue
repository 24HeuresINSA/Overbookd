<template>
  <v-card class="filters_volunteers">
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field v-model="search" label="Recherche" :disabled="disabled" />
      <SearchTeams
        v-model="teams"
        :teams="teams"
        label="Équipe(s)"
        :disabled="disabled"
      />
      <SearchTeams
        v-model="excludedTeams"
        label="Équipe(s) à exclure"
        :disabled="disabled"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/http";

const { disabled } = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const search = defineModel<string>("search", { required: true });
const teams = defineModel<Team[]>("teams", { required: true });
const excludedTeams = defineModel<Team[]>("excludedTeams", { required: true });
</script>
