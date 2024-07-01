<template>
  <div class="volunteers-page">
    <div class="filters">
      <VolunteerListFilters
        v-model:search="filters.search"
        v-model:teams="filters.teams"
        v-model:excluded-teams="filters.excludedTeams"
      />
    </div>
    <div class="table-container">
      <VolunteerList
        :volunteers="displayedVolunteers"
        :loading="loading"
        @open-dialog="openVolunteerInfoDialog"
        @click:team="addTeamInFilters"
      />
    </div>

    <v-dialog v-model="isVolunteerInfoDialogOpen" max-width="800">
      <VolunteerInformation @updated="closeVolunteerInfoDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/http";
import type { UserPersonalData } from "@overbookd/user";
import { keepMembersOf, excludeMembersOf } from "~/utils/search/search-team";
import { toSearchable } from "~/utils/search/search-user";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";

useHead({ title: "Liste des bénévoles" });

const userStore = useUserStore();

type Filters = {
  search: string;
  teams: Team[];
  excludedTeams: Team[];
};

const isVolunteerInfoDialogOpen = ref(false);

const filters = reactive<Filters>({
  search: "",
  teams: [],
  excludedTeams: [],
});

const loading = ref(false);
onMounted(async () => {
  loading.value = true;
  await userStore.fetchVolunteers();
  loading.value = false;
});

const volunteers = computed(() => userStore.volunteers);
const searchableVolunteers = computed(() =>
  volunteers.value.map((volunteer) => toSearchable(volunteer)),
);
const displayedVolunteers = computed(() => {
  const matchTeams = keepMembersOf(filters.teams);
  const matchExcludedTeams = excludeMembersOf(filters.excludedTeams);
  const matchName = filterVolunteersByName(filters.search);
  return searchableVolunteers.value.filter((volunteer) => {
    return (
      matchTeams(volunteer) &&
      matchExcludedTeams(volunteer) &&
      matchName(volunteer)
    );
  });
});

const filterVolunteersByName = (
  search: string,
): ((volunteer: Searchable<UserPersonalData>) => boolean) => {
  return keepMatchingSearchCriteria(search);
};

const addTeamInFilters = (team: Team) => {
  const teamAlreadyInFilters = filters.teams.some((t) => t.code === team.code);
  if (teamAlreadyInFilters) return;
  filters.teams = [...filters.teams, team];
};

const openVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = true;
};

const closeVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = false;
};
</script>

<style lang="scss" scoped>
.volunteers-page {
  display: flex;
  gap: 1em;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    margin-left: 0;
  }
}

.filters {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 20%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}

.table-container {
  width: 80%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}
</style>
