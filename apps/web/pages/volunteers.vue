<template>
  <DesktopPageTitle />
  <div class="volunteers-page">
    <VolunteerListHeader
      v-model:filters="filters"
      v-model:trombinoscope="isTrombinoscopeDisplayed"
      @export-csv="exportCSV"
    />

    <Trombinoscope
      v-show="isTrombinoscopeDisplayed"
      :volunteers="filteredVolunteers"
      :loading="loading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <VolunteerListCard
      v-show="!isTrombinoscopeDisplayed"
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
import {
  keepMembersOf,
  excludeMembersOf,
} from "~/utils/search/search-team.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
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
import { download } from "~/utils/file/download.utils";
import { formatDate } from "@overbookd/time";
import { formatUserPhone } from "~/utils/user/user.utils";
import { BENEVOLE_CODE } from "@overbookd/team-constants";

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
const openVolunteerInfoDialog = (
  volunteer: UserDataWithPotentialyProfilePicture,
) => {
  if (!userStore.can(VIEW_VOLUNTEER_DETAILS)) return;
  userStore.setSelectedUser(volunteer);
  isVolunteerInfoDialogOpen.value = true;
};
const closeVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = false;
};

const exportCSV = async () => {
  // Parse data into a CSV string to be passed to the download function
  const lineReturnRegex = new RegExp("(\\r\\n|\\n|\\r)", "gm");
  const csvHeader =
    "Prenom;Nom;Surnom;Charisme;Equipes;Email;Date de naissance;Telephone;Commentaire;Note";

  const sanitizeField = (field?: string | null): string => {
    if (!field) return "";

    const includesSemicolon = field.includes(";");
    return includesSemicolon ? `"${field.replaceAll('"', '""')}"` : field;
  };

  const csvContent = filteredVolunteers.value.map((volunteer) => {
    const teams = volunteer.teams.filter((team) => team !== BENEVOLE_CODE);
    return [
      volunteer.firstname,
      volunteer.lastname,
      volunteer.nickname,
      volunteer.charisma.toString(),
      teams.join(", "),
      volunteer.email,
      formatDate(volunteer.birthdate),
      formatUserPhone(volunteer.phone),
      volunteer.comment?.replace(lineReturnRegex, " "),
      volunteer.note?.replace(lineReturnRegex, " "),
    ]
      .map(sanitizeField)
      .join(";");
  });

  const csv = [csvHeader, ...csvContent].join("\n");
  download("benevoles.csv", csv);
};
</script>

<style scoped>
.volunteers-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
