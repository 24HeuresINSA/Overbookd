<template>
  <DesktopPageTitle />
  <div class="registrations">
    <RegistrationConfigurationCard class="registration-configuration" />

    <v-card>
      <v-card-title>Nouveaux arrivants</v-card-title>
      <v-card-text>
        <v-data-table
          v-model="selectedStaffs"
          :headers="headers"
          :items="filteredNewcomers"
          :items-per-page="30"
          :loading="loading"
          loading-text="Chargement des nouveaux arrivants..."
          no-data-text="Aucun nouvel arrivant"
          show-select
          return-object
        >
          <template #top>
            <v-text-field
              v-model="searchNewcomer"
              label="Rechercher un nouvel arrivant"
              class="search-filter"
              clearable
              hide-details
              @click:clear="searchNewcomer = ''"
            />
          </template>

          <template #item.teams="{ item }">
            <TeamChip v-for="team of item.teams" :key="team" :team="team" />
          </template>

          <template #item.removal="{ item }">
            <v-btn
              text="Rejeter la candidature"
              color="tertiary"
              size="small"
              @click="rejectApplication(item.id)"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
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
  { title: "Suppression", value: "removal" },
];

const searchNewcomer = ref<string>("");
const selectedStaffs = ref<StaffCandidate[]>([]);

const staffs = computed<StaffCandidate[]>(
  () => membershipApplicationStore.staffs,
);
const loading = ref<boolean>(staffs.value.length === 0);
membershipApplicationStore
  .fetchStaffCandidates()
  .then(() => (loading.value = false));

const noStaffSelected = computed<boolean>(
  () => selectedStaffs.value.length === 0,
);

const searchableNewcomers = computed<Searchable<StaffCandidate>[]>(() =>
  staffs.value.map(toSearchable),
);
const filteredNewcomers = computed<StaffCandidate[]>(() =>
  matchingSearchItems(searchableNewcomers.value, searchNewcomer.value),
);

const enrollNewcomers = () => {
  membershipApplicationStore.enrollStaffs(selectedStaffs.value);
  selectedStaffs.value = [];
};
const rejectApplication = (candidateId: number) => {
  membershipApplicationStore.rejectForStaff(candidateId);
};
</script>

<style lang="scss" scoped>
.registrations {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.registration-configuration {
  margin: 10px 0;
}

.search-filter {
  margin: 5px 0;
}
</style>
