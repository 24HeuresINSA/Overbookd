<template>
  <v-autocomplete
    v-model="team"
    :items="teamList"
    item-title="name"
    item-value="code"
    :label="label"
    :disabled="disabled"
    :hide-details="hideDetails"
    :clearable="clearable"
    hide-selected
    return-object
    :custom-filter="slugifiedFilter"
    no-data-text="Aucune équipe correspondante"
  >
    <template #selection="{ item }">
      <TeamChip :team="item.value" with-name show-hidden />
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/http";
import { slugifiedFilter } from "~/utils/search/search.utils";

const team = defineModel<Team>({ required: false });

const props = defineProps({
  label: {
    type: String,
    default: "Chercher des équipes",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
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
</script>
