<template>
  <DesktopPageTitle />
  <div class="registrations">
    <RegistrationConfigurationCard class="registration-configuration" />

    <v-card>
      <v-card-title>Candidats</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selectedCandidates"
          :headers="headers"
          :items="filteredCandidates"
          :items-per-page="30"
          :loading="loading"
          loading-text="Chargement des candidats..."
          :no-data-text="`Aucun candidat ${displayRejectedCandidates ? 'rejeté' : ''}`"
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

          <template #item.teams="{ item }">
            <TeamChip v-for="team of item.teams" :key="team" :team="team" />
          </template>

          <template #item.action="{ item }">
            <v-btn
              v-show="!displayRejectedCandidates"
              text="Rejeter la candidature"
              color="tertiary"
              size="small"
              @click="rejectApplication(item.id)"
            />
            <v-btn
              v-show="displayRejectedCandidates"
              text="Annuler le rejet"
              color="tertiary"
              size="small"
              @click="cancelApplicationRejection(item.id)"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!displayRejectedCandidates"
          text=" Enrôler en tant que hard"
          :disabled="noStaffSelected"
          size="large"
          @click="enrollNewcomers"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { StaffCandidate } from "@overbookd/http";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { toSearchable } from "~/utils/search/search-user";

useHead({ title: "Admissions organisateur" });

const membershipApplicationStore = useMembershipApplicationStore();

const headers = [
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Email", value: "email", sortable: true },
  { title: "Équipes", value: "teams" },
  { title: "Action", value: "action" },
];

const searchedCandidate = ref<string>("");
const selectedCandidates = ref<StaffCandidate[]>([]);

const cadidates = computed<StaffCandidate[]>(
  () => membershipApplicationStore.staffs,
);
const loading = ref<boolean>(cadidates.value.length === 0);
membershipApplicationStore
  .fetchStaffCandidates()
  .then(() => (loading.value = false));

const displayRejectedCandidates = ref<boolean>(false);
const rejectedCandidates = computed<StaffCandidate[]>(
  () => membershipApplicationStore.rejectedStaffs,
);
const searchableRejectedCandidates = computed<Searchable<StaffCandidate>[]>(
  () => rejectedCandidates.value.map(toSearchable),
);

const noStaffSelected = computed<boolean>(
  () => selectedCandidates.value.length === 0,
);

const searchableCandidates = computed<Searchable<StaffCandidate>[]>(() =>
  cadidates.value.map(toSearchable),
);
const filteredCandidates = computed<StaffCandidate[]>(() =>
  displayRejectedCandidates.value
    ? matchingSearchItems(
        searchableRejectedCandidates.value,
        searchedCandidate.value,
      )
    : matchingSearchItems(searchableCandidates.value, searchedCandidate.value),
);

const enrollNewcomers = () => {
  membershipApplicationStore.enrollStaffs(selectedCandidates.value);
  selectedCandidates.value = [];
};
const rejectApplication = (candidateId: number) => {
  membershipApplicationStore.rejectForStaff(candidateId);
};

const cancelApplicationRejection = (candidateId: number) => {
  membershipApplicationStore.cancelRejectionForStaff(candidateId);
};

const toggleRejectedCandidates = () => {
  displayRejectedCandidates.value = !displayRejectedCandidates.value;
  if (!displayRejectedCandidates.value) {
    membershipApplicationStore.fetchStaffCandidates();
    return;
  }

  loading.value = rejectedCandidates.value.length === 0;
  membershipApplicationStore
    .fetchRejectedStaffCandidates()
    .then(() => (loading.value = false));
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

.registration-configuration {
  margin: 10px 0;
}

.search-filter {
  margin: 5px 0;
}
</style>
