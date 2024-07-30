<template>
  <v-data-table
    :headers="tableHeaders"
    :items="filteredPotentialParticipants"
    :items-per-page="20"
    :loading="loading"
    loading-text="Chargement des bénévoles..."
    no-data-text="Aucun bénévole"
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Rechercher un bénévole"
        hide-details
      />
    </template>

    <template #item.firstname="{ item }">
      {{ formatUserNameWithNickname(item) }}
    </template>

    <template #item.newCharisma="{ item }">
      {{ calculatedNewCharisma[item.id] }}
    </template>

    <template #item.hours="{ item }">
      <v-text-field
        v-model="item.hours"
        type="number"
        :rules="[isNumber, isInteger, min(0)]"
        hide-details
        @update:model-value="updateParticipation(item, $event)"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { CharismaEventParticipant } from "~/utils/charisma/charisma-event";
import type { TableHeaders } from "~/utils/data-table/header";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { isNumber, min, isInteger } from "~/utils/rules/input.rules";
import { toSearchable } from "~/utils/search/search-user";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";

const props = defineProps({
  charismaPerHour: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const tableHeaders: TableHeaders = [
  { title: "Nom", value: "firstname", sortable: true },
  { title: "Charisme actuel", value: "charisma", sortable: true },
  { title: "Charisme à ajouter", value: "newCharisma", sortable: true },
  { title: "Nombre d'heures participées", value: "hours", sortable: true },
];

const potentialParticipants = defineModel<CharismaEventParticipant[]>(
  "potentialParticipants",
  { required: true },
);

const search = ref<string>("");
const searchablePotentialParticipants = computed<
  Searchable<CharismaEventParticipant>[]
>(() => {
  return potentialParticipants.value.map(toSearchable);
});
const filteredPotentialParticipants = computed<CharismaEventParticipant[]>(() =>
  matchingSearchItems(searchablePotentialParticipants.value, search.value),
);

const calculatedNewCharisma = computed<Record<number, number>>(() => {
  const result: Record<number, number> = {};
  filteredPotentialParticipants.value.forEach((participant) => {
    result[participant.id] = participant.hours * props.charismaPerHour;
  });
  return result;
});

const updateParticipation = (
  participant: CharismaEventParticipant,
  hours: string,
) => {
  const participantFromModel = potentialParticipants.value.find(
    ({ id }) => id === participant.id,
  );
  if (!participantFromModel) return;
  participantFromModel.hours = +hours >= 0 ? +hours : 0;
};
</script>
