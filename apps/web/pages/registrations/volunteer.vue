<template>
  <DesktopPageTitle />
  <v-card class="registrations">
    <v-card-title>Candidats</v-card-title>
    <v-card-text>
      <v-data-table
        v-model="selectedCandidates"
        :headers="headers"
        :items="filteredCandidates"
        :loading="loading"
        loading-text="Chargement des candidats..."
        :no-data-text="`Aucun candidat ${displayRejectedCandidates ? 'rejeté' : ''}`"
        :mobile="isMobile"
        show-select
        return-object
      >
        <template #top>
          <div class="filters">
            <v-text-field
              v-model="searchedCandidate"
              label="Rechercher un candidat"
              class="search-filter"
              clearable
              hide-details
              @click:clear="searchedCandidate = ''"
            />
            <v-btn
              text="Candidats rejetés"
              color="secondary"
              :variant="displayRejectedCandidates ? 'elevated' : 'outlined'"
              @click="toggleRejectedCandidates"
            />
          </div>
        </template>

        <template #item.candidatedAt="{ item }">
          {{ formatDate(item.candidatedAt) }}
        </template>

        <template #item.teams="{ item }">
          <TeamChip v-for="team of item.teams" :key="team" :team="team" />
        </template>

        <template #item.action="{ item }">
          <v-btn
            v-show="!displayRejectedCandidates"
            text="Rejeter la candidature"
            color="tertiary"
            size="small"
            @click="rejectCandidate(item.id)"
          />
          <v-btn
            v-show="displayRejectedCandidates"
            text="Annuler le rejet"
            color="tertiary"
            size="small"
            @click="cancelCandidateRejection(item.id)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="!displayRejectedCandidates"
        text="Enrôler en tant que bénévole festival"
        :disabled="noVolunteerSelected"
        size="large"
        @click="enrollCandidates"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { VolunteerCandidate } from "@overbookd/http";
import { formatDate } from "@overbookd/time";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";

useHead({ title: "Admissions bénévoles" });

const membershipApplicationStore = useMembershipApplicationStore();
const layoutStore = useLayoutStore();

const headers = [
  { title: "Date de canidature", value: "candidatedAt", sortable: true },
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Email", value: "email" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Équipes", value: "teams" },
  { title: "Action", value: "action" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const searchedCandidate = ref<string>("");
const selectedCandidates = ref<VolunteerCandidate[]>([]);

const candidates = computed<VolunteerCandidate[]>(
  () => membershipApplicationStore.volunteerCandidates,
);
const loading = ref<boolean>(candidates.value.length === 0);
membershipApplicationStore.fetchVolunteerCandidates().then(() => {
  loading.value = false;
});
const searchableEnrollableCandidates = computed<
  Searchable<VolunteerCandidate>[]
>(() => candidates.value.map(toSearchable));

const displayRejectedCandidates = ref<boolean>(false);
const rejectedCandidates = computed<VolunteerCandidate[]>(
  () => membershipApplicationStore.rejectedVolunteerCandidates,
);
const searchableRejectedCandidates = computed<Searchable<VolunteerCandidate>[]>(
  () => rejectedCandidates.value.map(toSearchable),
);

const filteredCandidates = computed<VolunteerCandidate[]>(() => {
  const searchableCandidates = displayRejectedCandidates.value
    ? searchableRejectedCandidates.value
    : searchableEnrollableCandidates.value;
  return matchingSearchItems(searchableCandidates, searchedCandidate.value);
});

const toggleRejectedCandidates = () => {
  displayRejectedCandidates.value = !displayRejectedCandidates.value;
  if (!displayRejectedCandidates.value) {
    loading.value = candidates.value.length === 0;
    membershipApplicationStore.fetchVolunteerCandidates().then(() => {
      loading.value = false;
    });
    return;
  }
  selectedCandidates.value = [];
  loading.value = rejectedCandidates.value.length === 0;
  membershipApplicationStore.fetchRejectedVolunteerCandidates().then(() => {
    loading.value = false;
  });
};

const noVolunteerSelected = computed<boolean>(
  () => selectedCandidates.value.length === 0,
);

const enrollCandidates = () => {
  membershipApplicationStore.enrollNewVolunteers(selectedCandidates.value);
  selectedCandidates.value = [];
};
const rejectCandidate = (candidateId: number) => {
  membershipApplicationStore.rejectVolunteerCandidate(candidateId);
};
const cancelCandidateRejection = (candidateId: number) => {
  membershipApplicationStore.cancelVolunteerCandidateRejection(candidateId);
};
</script>

<style lang="scss" scoped>
.registrations {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.filters {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-filter {
  margin: 5px 0;
}
</style>
