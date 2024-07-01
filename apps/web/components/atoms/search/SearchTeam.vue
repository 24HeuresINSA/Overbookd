<template>
  <v-combobox
    v-model="team"
    :items="allTeams"
    item-title="name"
    item-value="code"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    clearable
    hide-selected
    return-object
  >
    <template #selection="{ item }">
      <TeamChip :team="item.value" with-name show-hidden />
    </template>
    <template #no-data>
      <v-list-item> Aucune équipe correspondante </v-list-item>
    </template>
  </v-combobox>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/http";

const { label, disabled, hideDetails } = defineProps({
  label: {
    type: String,
    default: "Chercher des équipes",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

const teamStore = useTeamStore();
const team = defineModel<Team>({ required: false });
const allTeams = computed(() => teamStore.teams);
</script>
