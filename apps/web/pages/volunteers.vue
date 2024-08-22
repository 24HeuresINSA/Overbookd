<template>
  <DesktopPageTitle />
  <div class="volunteers-page">
    <VolunteerListHeader
      v-model:filters="filters"
      v-model:trombinoscope="isTrombinoscopeDisplayed"
    />

    <Trombinoscope
      v-if="isTrombinoscopeDisplayed"
      :volunteers="filteredVolunteers"
      :loading="loading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <VolunteerListCard
      v-else
      :volunteers="filteredVolunteers"
      :loading="loading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
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
import { VIEW_VOLUNTEER_DETAILS } from "@overbookd/permission";
import { keepMembersOf, excludeMembersOf } from "~/utils/search/search-team";
import { toSearchable } from "~/utils/search/search-user";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import {
  VolunteerFilterBuilder,
  type VolunteerFilters,
} from "~/utils/user/volunteer.filter";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

useHead({ title: "Liste des bénévoles" });

const route = useRoute();
const userStore = useUserStore();

const volunteers = computed<UserDataWithPotentialyProfilePicture[]>(
  () => userStore.volunteers,
);
const loading = ref<boolean>(volunteers.value.length === 0);
userStore.fetchVolunteers().then(() => (loading.value = false));

const isTrombinoscopeDisplayed = ref<boolean>(true);

const filters = ref<VolunteerFilters>({});
onMounted(
  () => (filters.value = VolunteerFilterBuilder.getFromRouteQuery(route.query)),
);

const searchableVolunteers = computed<
  Searchable<UserDataWithPotentialyProfilePicture>[]
>(() => volunteers.value.map(toSearchable));
const filteredVolunteers = computed<UserDataWithPotentialyProfilePicture[]>(
  () => {
    const { search, teams, excludedTeams } = filters.value;
    return searchableVolunteers.value.filter((volunteer) => {
      return (
        keepMembersOf(teams ?? [])(volunteer) &&
        excludeMembersOf(excludedTeams ?? [])(volunteer) &&
        keepMatchingSearchCriteria(search ?? "")(volunteer)
      );
    });
  },
);

const addTeamInFilters = (team: Team) => {
  const currentTeams = filters.value.teams ?? [];
  const alreadyIn = currentTeams.some(({ code }) => code === team.code);
  if (alreadyIn) return;

  filters.value.teams = [...currentTeams, team];
  const teamsCode = filters.value.teams.map(({ code }) => code);
  updateQueryParams("teams", teamsCode);
};

const selectedVolunteer = computed(() => userStore.selectedUser);
const isVolunteerInfoDialogOpen = ref<boolean>(false);
const openVolunteerInfoDialog = async (
  volunteer: UserDataWithPotentialyProfilePicture,
) => {
  if (!userStore.can(VIEW_VOLUNTEER_DETAILS)) return;
  await userStore.setSelectedUser(volunteer);
  isVolunteerInfoDialogOpen.value = true;
};
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
