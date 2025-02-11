<template>
  <DesktopPageTitle />
  <v-card class="registrations">
    <v-card-title>Candidats</v-card-title>
    <v-card-text>
      <v-data-table
        v-model="candidatesToEnroll"
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

        <template #item.actions="{ item }">
          <v-btn
            v-if="!displayRejectedCandidates"
            icon="mdi-check"
            size="large"
            variant="flat"
            @click="enrollCandidate(item)"
          />
          <v-btn
            icon="mdi-account-details"
            size="large"
            variant="flat"
            @click="openCandidateInfoDialogue(item)"
          />
          <v-btn
            v-if="!displayRejectedCandidates"
            icon="mdi-trash-can-outline"
            size="large"
            variant="flat"
            @click="rejectCandidate(item.id)"
          />
          <v-btn
            v-else
            icon="mdi-undo"
            size="large"
            variant="flat"
            @click="cancelCandidateRejection(item.id)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        v-if="!displayRejectedCandidates"
        text="Enrôler en tant que bénévole"
        :disabled="noVolunteerSelected"
        size="large"
        @click="enrollCandidates"
      />
    </v-card-actions>
  </v-card>

  <v-dialog v-model="isCandidateInfoDialogOpen" max-width="1400px">
    <VolunteerInformationDialogCard
      v-if="selectedUser"
      :volunteer="selectedUser"
      hide-delete-button
      @close="closeCandidateInfoDialogue"
    >
      <template #additional-actions>
        <v-btn
          v-if="!displayRejectedCandidates"
          :text="
            isSelectedCandidateInCandidatesToEnroll
              ? 'Retirer des candidats à enrôler'
              : 'Ajouter aux candidats à enrôler'
          "
          color="primary"
          size="large"
          @click="
            selectedCandidate && updateCandidatesToEnroll(selectedCandidate)
          "
        />
        <v-btn
          v-if="!displayRejectedCandidates"
          text="Rejeter la candidature"
          color="error"
          size="large"
          @click="selectedCandidate && rejectCandidate(selectedCandidate.id)"
        />
        <v-btn
          v-else
          text="Restaurer la candidature"
          color="secondary"
          size="large"
          @click="
            selectedCandidate && cancelCandidateRejection(selectedCandidate.id)
          "
        />
      </template>
    </VolunteerInformationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { VolunteerCandidate } from "@overbookd/http";
import { formatDate } from "@overbookd/time";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

useHead({ title: "Admissions bénévoles" });

const membershipApplicationStore = useMembershipApplicationStore();
const layoutStore = useLayoutStore();
const userStore = useUserStore();

const headers = [
  { title: "Date de canidature", value: "candidatedAt", sortable: true },
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Email", value: "email" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Équipes", value: "teams", sortable: true },
  { title: "Actions", value: "actions" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const searchedCandidate = ref<string>("");
const candidatesToEnroll = ref<VolunteerCandidate[]>([]);

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
  candidatesToEnroll.value = [];
  loading.value = rejectedCandidates.value.length === 0;
  membershipApplicationStore.fetchRejectedVolunteerCandidates().then(() => {
    loading.value = false;
  });
};

const noVolunteerSelected = computed<boolean>(
  () => candidatesToEnroll.value.length === 0,
);

const enrollCandidate = (candidate: VolunteerCandidate) => {
  membershipApplicationStore.enrollNewVolunteers([candidate]);
};
const enrollCandidates = () => {
  membershipApplicationStore.enrollNewVolunteers(candidatesToEnroll.value);
  candidatesToEnroll.value = [];
};
const rejectCandidate = (candidateId: number) => {
  membershipApplicationStore.rejectVolunteerCandidate(candidateId);
  closeCandidateInfoDialogue();
};
const cancelCandidateRejection = (candidateId: number) => {
  membershipApplicationStore.cancelVolunteerCandidateRejection(candidateId);
  closeCandidateInfoDialogue();
};

const isCandidateInfoDialogOpen = ref<boolean>(false);
const selectedCandidate = computed<VolunteerCandidate | undefined>(
  () => membershipApplicationStore.selectedVolunteerCandidate,
);
const isSelectedCandidateInCandidatesToEnroll = computed<boolean>(() =>
  selectedCandidate.value
    ? candidatesToEnroll.value.includes(selectedCandidate.value)
    : false,
);
const selectedUser = computed<UserDataWithPotentialyProfilePicture | undefined>(
  () => userStore.selectedUser,
);
const openCandidateInfoDialogue = (candidate: VolunteerCandidate) => {
  membershipApplicationStore.setSelectedVolunteerCandidate(candidate);
  userStore.findUserById(candidate.id);
  isCandidateInfoDialogOpen.value = true;
};
const closeCandidateInfoDialogue = () => {
  isCandidateInfoDialogOpen.value = false;
};

const updateCandidatesToEnroll = (candidate: VolunteerCandidate) => {
  if (candidatesToEnroll.value.includes(candidate)) {
    candidatesToEnroll.value = candidatesToEnroll.value.filter(
      (c) => c.id !== candidate.id,
    );
    return;
  }
  candidatesToEnroll.value = [...candidatesToEnroll.value, candidate];
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
