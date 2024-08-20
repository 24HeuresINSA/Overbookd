<template>
  <DesktopPageTitle title="Participations aux événements charismatiques" />
  <v-card>
    <v-card-text>
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

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="flat"
            @click="openEditDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click="removeParticipation(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="isEditDialogOpen" width="600">
      <EditCharismaEventParticipationDialogCard
        v-if="participationToEdit"
        :participation="participationToEdit"
        @edit="editParticipation"
        @close="closeEditDialog"
      />
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import type { CharismaEventParticipation } from "@overbookd/charisma";
import { SlugifyService } from "@overbookd/slugify";
import { buildUserNameWithNickname } from "@overbookd/user";
import { formatDate } from "@overbookd/time";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";

const charismaEventStore = useCharismaEventStore();

const tableHeaders: TableHeaders = [
  { title: "Evénement", value: "name", sortable: true },
  { title: "Date", value: "eventDate", sortable: true },
  { title: "Participant", value: "participant" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Actions", value: "actions" },
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

const participationToEdit = ref<CharismaEventParticipation | undefined>();
const isEditDialogOpen = ref<boolean>(false);
const openEditDialog = (participation: CharismaEventParticipation) => {
  participationToEdit.value = participation;
  isEditDialogOpen.value = true;
};
const closeEditDialog = () => (isEditDialogOpen.value = false);

const editParticipation = (newCharisma: number) => {
  if (!participationToEdit.value) return;
  const participation = {
    slug: participationToEdit.value.slug,
    eventDate: participationToEdit.value.eventDate,
    participantId: participationToEdit.value.participant.id,
    charisma: newCharisma,
  };
  charismaEventStore.editParticipation(participation);
  closeEditDialog();
};
const removeParticipation = (participation: CharismaEventParticipation) => {
  charismaEventStore.removeParticipation(participation);
};
</script>
