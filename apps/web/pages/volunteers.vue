<template>
  <DesktopPageTitle />
  <div class="volunteers-page">
    <VolunteerListHeader
      v-model:filters="filters"
      v-model:display-mode="displayMode"
      @export-csv="exportCSV"
      @download-leaflets="openDownloadLeafletsDialog"
    />

    <Trombinoscope
      v-show="displayMode === TROMBINOSCOPE"
      :volunteers="filteredVolunteers"
      :loading="loading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <VolunteerListCard
      v-show="displayMode === VOLUNTEER_LIST"
      :volunteers="filteredVolunteers"
      :loading="loading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <VolunteerStatsCard
      v-if="canManageAvailabilitiesOrViewStats"
      v-show="displayMode === VOLUNTEER_STATS"
      :volunteers="filteredVolunteers"
      :loading="loading"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <v-dialog
      v-model="isVolunteerInfoDialogOpen"
      :max-width="canManageAvailabilitiesOrViewStats ? 1400 : 700"
    >
      <VolunteerInformationDialogCard
        v-if="selectedVolunteer"
        :volunteer="selectedVolunteer"
        @updated="closeVolunteerInfoDialog"
        @close="closeVolunteerInfoDialog"
      />
    </v-dialog>

    <v-dialog
      v-if="canManageUsers"
      v-model="isDownloadLeafletsOpen"
      width="1000"
    >
      <DownloadLeafletsCard @close="closeDownloadLeafletsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import {
  VIEW_VOLUNTEER_DETAILS,
  AFFECT_VOLUNTEER,
  MANAGE_USERS,
} from "@overbookd/permission";
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
import { sanitizeFieldForCSV } from "~/utils/file/csv.utils";
import { formatDate } from "@overbookd/time";
import { formatUserPhone } from "~/utils/user/user.utils";
import { BENEVOLE_CODE } from "@overbookd/team-constants";
import {
  DisplayModeBuilder,
  TROMBINOSCOPE,
  VOLUNTEER_LIST,
  VOLUNTEER_STATS,
  type DisplayMode,
} from "~/utils/user/volunteer.display";

useHead({ title: "Liste des bénévoles" });

const route = useRoute();
const userStore = useUserStore();
const availabilityStore = useVolunteerAvailabilityStore();

const volunteers = computed<UserDataWithPotentialyProfilePicture[]>(
  () => userStore.volunteers,
);
const loading = ref<boolean>(volunteers.value.length === 0);
userStore.fetchVolunteers().then(() => (loading.value = false));

const filters = ref<VolunteerFilters>({});
const displayMode = ref<DisplayMode>(TROMBINOSCOPE);
onMounted(() => {
  filters.value = VolunteerFilterBuilder.getFromRouteQuery(route.query);
  displayMode.value = DisplayModeBuilder.getFromRouteQuery(route.query);
});

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
const canManageAvailabilitiesOrViewStats = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
const openVolunteerInfoDialog = (
  volunteer: UserDataWithPotentialyProfilePicture,
) => {
  if (!userStore.can(VIEW_VOLUNTEER_DETAILS)) return;
  userStore.setSelectedUser(volunteer);
  if (canManageAvailabilitiesOrViewStats.value) {
    availabilityStore.fetchVolunteerAvailabilities(volunteer.id);
  }
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
      .map(sanitizeFieldForCSV)
      .join(";");
  });

  const csv = [csvHeader, ...csvContent].join("\n");
  download("benevoles.csv", csv);
};

const canManageUsers = computed<boolean>(() => userStore.can(MANAGE_USERS));
const isDownloadLeafletsOpen = ref<boolean>(false);
const openDownloadLeafletsDialog = () => {
  if (!canManageUsers.value) return;
  isDownloadLeafletsOpen.value = true;
};
const closeDownloadLeafletsDialog = () => {
  isDownloadLeafletsOpen.value = false;
};
</script>

<style scoped>
.volunteers-page {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
</style>
