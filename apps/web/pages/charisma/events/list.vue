<template>
  <h1>Participations aux événements charismatiques</h1>
  <v-data-table
    :headers="tableHeaders"
    :items="filteredParticipations"
    :items-per-page="50"
    :loading="loading"
    density="comfortable"
    loading-text="Chargement des participations aux événements..."
    no-data-text="Aucune participation aux événements"
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Rechercher une participation"
        hide-details
      />
    </template>

    <template #item.eventDate="{ item }">
      {{ formatDate(new Date(item.eventDate)) }}
    </template>

    <template #item.participant="{ item }">
      {{ buildUserNameWithNickname(item.participant) }}
    </template>

    <template #item.removal="{ item }">
      <v-btn
        icon="mdi-delete"
        size="small"
        density="comfortable"
        @click="removeParticipation(item)"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { CharismaEventParticipation } from "@overbookd/charisma";
import { SlugifyService } from "@overbookd/slugify";
import { buildUserNameWithNickname } from "@overbookd/user";
import { formatDate } from "@overbookd/date";
import type { TableHeaders } from "~/utils/data-table/header";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";

const charismaEventStore = useCharismaEventStore();

const tableHeaders: TableHeaders = [
  { title: "Evénement", value: "name", sortable: true },
  { title: "Date", value: "eventDate", sortable: true },
  { title: "Participant", value: "participant" },
  { title: "Suppression", value: "removal" },
];

const allParticipations = computed<CharismaEventParticipation[]>(
  () => charismaEventStore.allParticipations,
);
const loading = ref<boolean>(allParticipations.value.length === 0);
charismaEventStore.fetchAllParticipations().then(() => (loading.value = false));

const search = ref<string>("");
const searchableParticipations = computed<
  Searchable<CharismaEventParticipation>[]
>(() => {
  return allParticipations.value.map((participation) => {
    const { slug, eventDate, charisma, participant } = participation;
    const event = `${slug} ${formatDate(eventDate)} ${charisma}`;
    const volunteer = `${participant.firstname} ${participant.lastname} ${participant.nickname}`;
    return {
      ...participation,
      searchable: SlugifyService.apply(`${event} ${volunteer}`),
    };
  });
});
const filteredParticipations = computed<CharismaEventParticipation[]>(() => {
  return matchingSearchItems(searchableParticipations.value, search.value);
});

const removeParticipation = (participation: CharismaEventParticipation) => {
  charismaEventStore.removeParticipation(participation);
};
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 10px;
}
</style>
