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
            <div class="filters">
              <v-text-field
                v-model="searchNewcomer"
                label="Rechercher un nouvel arrivant"
                clearable
                hide-details
                @click:clear="searchNewcomer = ''"
              />
              <v-btn
                text="Inscrits dans les 30 derniers jours"
                color="secondary"
                :variant="last30DaysNewcomers ? 'elevated' : 'outlined'"
                @click="toggleLast30DaysNewcomers"
              />
            </div>
          </template>

          <template #item.registeredAt="{ item }">
            {{ formatLocalDate(item.registeredAt) }}
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
          @click="enrollNewcomers"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { SlugifyService } from "@overbookd/slugify";
import { ONE_DAY_IN_MS, formatLocalDate } from "@overbookd/time";
import type { EnrollableStaff } from "@overbookd/http";
import type { Searchable } from "~/utils/search/search.utils";

type Filter = (newcomer: Searchable<EnrollableStaff>) => boolean;

useHead({ title: "Admissions organisateur" });

const registrationStore = useRegistrationStore();
const membershipApplicationStore = useMembershipApplicationStore();

const headers = [
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Email", value: "email", sortable: true },
  { title: "Date d'inscription", value: "registeredAt", sortable: true },
  { title: "Équipes", value: "teams" },
  { title: "Suppression", value: "removal" },
];

const last30DaysNewcomers = ref<boolean>(true);
const searchNewcomer = ref<string>("");
const selectedStaffs = ref<EnrollableStaff[]>([]);

const staffs = computed<EnrollableStaff[]>(() => registrationStore.staffs);
const loading = ref<boolean>(staffs.value.length === 0);
registrationStore.getStaffs().then(() => (loading.value = false));

const noStaffSelected = computed<boolean>(
  () => selectedStaffs.value.length === 0,
);

const searchableNewcomers = computed<Searchable<EnrollableStaff>[]>(() => {
  return staffs.value.map((newcomer) => ({
    ...newcomer,
    searchable: SlugifyService.apply(
      `${newcomer.firstname} ${newcomer.lastname}`,
    ),
  }));
});
const filteredNewcomers = computed<EnrollableStaff[]>(() => {
  const search = SlugifyService.apply(searchNewcomer.value);
  const thirtyDaysAgo = Date.now() - 30 * ONE_DAY_IN_MS;
  return searchableNewcomers.value.filter((newcomer) => {
    return (
      isMatchingNameSearch(search)(newcomer) &&
      isMatchingRegistrationDateLimit(thirtyDaysAgo)(newcomer)
    );
  });
});
const isMatchingNameSearch = (search: string): Filter => {
  return ({ searchable }: Searchable<EnrollableStaff>) =>
    searchable.includes(search);
};
const isMatchingRegistrationDateLimit = (dateLimit: number): Filter => {
  return ({ registeredAt }: EnrollableStaff) => {
    if (!last30DaysNewcomers.value) return true;
    return registeredAt.getTime() > dateLimit;
  };
};

const enrollNewcomers = () => {
  registrationStore.enrollStaffs(selectedStaffs.value);
  selectedStaffs.value = [];
};
const toggleLast30DaysNewcomers = () => {
  last30DaysNewcomers.value = !last30DaysNewcomers.value;
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

.filters {
  display: flex;
  align-items: center;
  gap: 20px;
}

.registration-configuration {
  margin: 10px 0;
}
</style>
