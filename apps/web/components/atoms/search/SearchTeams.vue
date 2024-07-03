<template>
  <v-combobox
    v-model="teams"
    :items="allTeams"
    item-title="name"
    item-value="code"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    multiple
    clearable
    hide-selected
    return-object
    no-data-text="Aucune équipe correspondante"
  >
    <template #selection="{ item }">
      <TeamChip :team="item.value" with-name show-hidden />
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
const teams = defineModel<Team[]>({ required: true });
const allTeams = computed(() => teamStore.teams);
</script>
