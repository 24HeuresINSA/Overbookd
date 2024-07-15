<template>
  <v-autocomplete
    v-model="teams"
    :items="teamList"
    item-title="name"
    item-value="code"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :closable-chips="closableChips"
    multiple
    clearable
    clear-on-select
    auto-select-first
    hide-selected
    return-object
    :custom-filter="slugifiedFilter"
    no-data-text="Aucune équipe correspondante"
  >
    <template #selection="{ item }">
      <TeamChip
        :team="item.value"
        :closable="closableChips"
        with-name
        show-hidden
        @close="closeChip"
      />
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import { slugifiedFilter } from "~/utils/search/search.utils";

const teams = defineModel<Team[]>({ required: true });

const props = defineProps({
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
  closableChips: {
    type: Boolean,
    default: false,
  },
  list: {
    type: Array as () => Team[] | null,
    default: () => null,
  },
});

const teamStore = useTeamStore();
const teamList = computed(() => props.list ?? teamStore.teams);

const closeChip = (teamCode: string) => {
  teams.value = teams.value.filter((team) => team.code !== teamCode);
};
</script>
