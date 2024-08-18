<template>
  <v-card>
    <v-card-title>Filtres</v-card-title>
    <v-card-text class="filters">
      <v-text-field
        v-model="search"
        label="Recherche"
        :disabled="disabled"
        hide-details
      />
      <SearchTeams
        v-model="teams"
        :teams="teams"
        label="Équipe(s)"
        :disabled="disabled"
        closable-chips
        hide-details
      />
      <SearchTeams
        v-model="excludedTeams"
        label="Équipe(s) à exclure"
        :disabled="disabled"
        closable-chips
        hide-details
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";

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

<style lang="scss" scoped>
.filters {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
