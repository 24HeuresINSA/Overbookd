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
    :density="density"
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
import type { Team } from "@overbookd/team";
import { slugifiedFilter } from "~/utils/search/search.utils";
import type { Density } from "~/utils/vuetify/component-props";

const team = defineModel<Team>("team", { required: false });

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
  density: {
    type: String as PropType<Density>,
    default: "comfortable",
  },
  list: {
    type: Array as PropType<Team[] | null>,
    default: () => null,
  },
});

const teamStore = useTeamStore();
const teamList = computed<Team[]>(() => props.list ?? teamStore.teams);
</script>
