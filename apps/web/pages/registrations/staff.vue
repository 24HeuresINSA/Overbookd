<template>
  <DesktopPageTitle />
  <div class="registrations">
    <RegistrationConfigurationCard class="registration-configuration" />

    <v-card>
      <v-card-title>Candidat·e·s</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selectedCandidates"
          :headers="headers"
          :items="filteredCandidates"
          :loading="loading"
          loading-text="Chargement des candidat·e·s..."
          :no-data-text="`Aucun candidat·e ${displayRejectedCandidates ? 'rejeté·e' : ''}`"
          :mobile="isMobile"
          show-select
          return-object
        >
          <template #top>
            <div class="filters">
              <v-text-field
                v-model="searchedCandidate"
                label="Rechercher un·e candidat·e"
                class="search-filter"
                clearable
                hide-details
                @click:clear="searchedCandidate = ''"
              />
              <v-btn
                text="Candidat·e·s rejetés"
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
              v-if="!displayRejectedCandidates"
              text="Rejeter la candidature"
              color="error"
              size="small"
              @click="rejectCandidate(item.id)"
            />
            <v-btn
              v-else
              text="Restaurer la candidature"
              color="warning"
              size="small"
              @click="cancelCandidateRejection(item.id)"
            />
            <v-btn
              v-if="canEnrollVolunteer"
              text="Passer en admission bénévole"
              color="secondary"
              size="small"
              @click="switchToVolunteerApplication(item.id)"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!displayRejectedCandidates"
          text="Enrôler en tant qu'organisateur·rice"
          color="success"
          :disabled="noStaffSelected"
          size="large"
          @click="enrollCandidates"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { StaffCandidate } from "@overbookd/http";
import { ENROLL_SOFT } from "@overbookd/permission";
import { formatDate } from "@overbookd/time";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";

useHead({ title: "Admissions organisateur·rice·s" });

const membershipApplicationStore = useMembershipApplicationStore();
const layoutStore = useLayoutStore();
const myStore = useMyStore();

const headers = [
  { title: "Date de candidature", value: "candidatedAt", sortable: true },
  { title: "Prénom", value: "firstName", sortable: true },
  { title: "Nom", value: "lastName", sortable: true },
  { title: "Email", value: "email" },
  { title: "Équipes", value: "teams" },
  { title: "Action", value: "action" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const canEnrollVolunteer = computed<boolean>(() => myStore.can(ENROLL_SOFT));

const searchedCandidate = ref<string>("");
const selectedCandidates = ref<StaffCandidate[]>([]);

const cadidates = computed<StaffCandidate[]>(
  () => membershipApplicationStore.staffCandidates,
);
const loading = ref<boolean>(cadidates.value.length === 0);
membershipApplicationStore
  .fetchStaffCandidates()
  .then(() => (loading.value = false));
const searchableEnrollableCandidates = computed<Searchable<StaffCandidate>[]>(
  () => cadidates.value.map(toSearchable),
);

const displayRejectedCandidates = ref<boolean>(false);
const rejectedCandidates = computed<StaffCandidate[]>(
  () => membershipApplicationStore.rejectedStaffCandidates,
);
const searchableRejectedCandidates = computed<Searchable<StaffCandidate>[]>(
  () => rejectedCandidates.value.map(toSearchable),
);

const filteredCandidates = computed<StaffCandidate[]>(() => {
  const searchableCandidates = displayRejectedCandidates.value
    ? searchableRejectedCandidates.value
    : searchableEnrollableCandidates.value;
  return matchingSearchItems(searchableCandidates, searchedCandidate.value);
});

const toggleRejectedCandidates = () => {
  displayRejectedCandidates.value = !displayRejectedCandidates.value;
  if (!displayRejectedCandidates.value) {
    loading.value = cadidates.value.length === 0;
    membershipApplicationStore.fetchStaffCandidates().then(() => {
      loading.value = false;
    });
    return;
  }
  selectedCandidates.value = [];
  loading.value = rejectedCandidates.value.length === 0;
  membershipApplicationStore
    .fetchRejectedStaffCandidates()
    .then(() => (loading.value = false));
};

const noStaffSelected = computed<boolean>(
  () => selectedCandidates.value.length === 0,
);

const enrollCandidates = () => {
  membershipApplicationStore.enrollNewStaffs(selectedCandidates.value);
  selectedCandidates.value = [];
};
const rejectCandidate = (candidateId: number) => {
  membershipApplicationStore.rejectStaffCandidate(candidateId);
};
const cancelCandidateRejection = (candidateId: number) => {
  membershipApplicationStore.cancelStaffCandidateRejection(candidateId);
};
const switchToVolunteerApplication = (candidateId: number) => {
  membershipApplicationStore.switchStaffToVolunteerApplication(candidateId);
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
