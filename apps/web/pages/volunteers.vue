<template>
  <DesktopPageTitle />
  <div class="volunteers-page">
    <VolunteerListHeader
      v-model:search="filters.search"
      v-model:teams="filters.teams"
      v-model:excluded-teams="filters.excludedTeams"
    />
    <VolunteerListCard
      :volunteers="displayedVolunteers"
      :loading="loading"
      @open-details="openVolunteerInfoDialog"
      @click:team="addTeamInFilters"
    />

    <v-dialog v-model="isVolunteerInfoDialogOpen" max-width="700">
      <VolunteerInformation
        v-if="selectedVolunteer"
        :volunteer="selectedVolunteer"
        @updated="closeVolunteerInfoDialog"
        @close="closeVolunteerInfoDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
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

const filters = reactive<Filters>({
  search: "",
  teams: [],
  excludedTeams: [],
});

const volunteers = computed(() => userStore.volunteers);
const loading = ref<boolean>(volunteers.value.length === 0);
userStore.fetchVolunteers().then(() => (loading.value = false));

const searchableVolunteers = computed(() => volunteers.value.map(toSearchable));
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

const selectedVolunteer = computed(() => userStore.selectedUser);
const isVolunteerInfoDialogOpen = ref<boolean>(false);
const openVolunteerInfoDialog = () => (isVolunteerInfoDialogOpen.value = true);
const closeVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = false;
};
</script>

<style lang="scss" scoped>
.volunteers-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
