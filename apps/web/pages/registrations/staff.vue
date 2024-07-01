<template>
  <div class="registrations">
    <h1>Admission organisateurs</h1>
    <RegistrationConfiguration class="registration-configuration" />
    <v-divider />
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
      class="newcomer-listing"
    >
      <template #top>
        <div class="filters">
          <v-text-field
            v-model="searchNewcomer"
            label="Rechercher un nouvel arrivant"
            class="search"
          />
          <v-btn
            class="ma-2"
            color="primary"
            :variant="last30DaysNewcomers ? 'elevated' : 'outlined'"
            @click="toggleLast30DaysNewcomers"
          >
            Inscrits dans les 30 derniers jours
          </v-btn>
        </div>
      </template>

      <template #item.registeredAt="{ item }">
        {{ formatLocalDate(item.registeredAt) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>

      <template #item.action="{ item }">
        <v-btn color="primary" @click="forgetHim(item.email)">
          Supprimer l'inscription
        </v-btn>
      </template>
    </v-data-table>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        variant="elevated"
        :disabled="noStaffSelected"
        @click="enrollNewcomers"
      >
        Enrôler en tant que hard
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts" setup>
import { STAFF } from "@overbookd/registration";
import { SlugifyService } from "@overbookd/slugify";
import { ONE_DAY_IN_MS } from "@overbookd/period";
import type { EnrollableStaff } from "@overbookd/http";
import { formatLocalDate } from "~/utils/date/date.utils";
import type { Searchable } from "~/utils/search/search.utils";

type Filter = (newcomer: Searchable<EnrollableStaff>) => boolean;

useHead({ title: "Admissions organisateur" });

const registrationStore = useRegistrationStore();

const headers = [
  { title: "Prénom", value: "firstname" },
  { title: "Nom", value: "lastname" },
  { title: "Email", value: "email" },
  { title: "Date d'inscription", value: "registeredAt" },
  { title: "Équipes", value: "teams", sortable: false },
  { title: "Action", value: "action", sortable: false },
];

const last30DaysNewcomers = ref(true);
const searchNewcomer = ref("");
const selectedStaffs = ref<EnrollableStaff[]>([]);

const loading = ref(false);
onMounted(() => {
  loading.value = true;
  registrationStore.getStaffs();
  loading.value = false;
});

const noStaffSelected = computed(() => selectedStaffs.value.length === 0);

const searchableNewcomers = computed(() => {
  return registrationStore.staffs.map((newcomer) => ({
    ...newcomer,
    searchable: SlugifyService.apply(
      `${newcomer.firstname} ${newcomer.lastname}`,
    ),
  }));
});
const filteredNewcomers = computed(() => {
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
const forgetHim = (email: string) => {
  registrationStore.forget(STAFF, email);
};
</script>

<style lang="scss" scoped>
.registrations {
  margin-left: 10px;
  @media screen and (max-width: $mobile-max-width) {
    margin-left: 0;
  }
}

.filters {
  display: flex;
  gap: 20px;
  margin: 10px 20px;
}

.registration-configuration {
  margin: 10px 0;
}
</style>
