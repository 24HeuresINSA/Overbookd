<template>
  <DesktopPageTitle />
  <div class="volunteers-page">
    <VolunteerListHeader
      v-model:filters="filters"
      v-model:display-mode="displayMode"
      @update:display-mode="fetchAssignmentStatsIfNeeded"
      @export-csv="exportCSV"
      @download-leaflets="openDownloadLeafletsDialog"
    />

    <Trombinoscope
      v-show="displayMode === TROMBINOSCOPE"
      :volunteers="filteredVolunteers"
      :loading="allVolunteersLoading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <VolunteerListCard
      v-show="displayMode === VOLUNTEER_LIST"
      :volunteers="filteredVolunteers"
      :loading="allVolunteersLoading"
      @click:team="addTeamInFilters"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <VolunteerStatsCard
      v-if="canAssignVolunteer"
      v-show="displayMode === VOLUNTEER_STATS"
      :volunteers="filteredVolunteers"
      :loading="allVolunteersLoading || assignmentStatsLoading"
      @click:volunteer="openVolunteerInfoDialog"
    />

    <v-dialog
      v-model="isVolunteerInfoDialogOpen"
      :width="canAssignVolunteer ? 1400 : 700"
    >
      <VolunteerInformationDialogCard
        v-if="selectedVolunteer"
        :volunteer="selectedVolunteer"
        @updated="closeVolunteerInfoDialog"
        @close="closeVolunteerInfoDialog"
      />
    </v-dialog>

    <v-dialog v-model="isDownloadLeafletsOpen" width="1000">
      <DownloadLeafletsCard @close="closeDownloadLeafletsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import {
  VIEW_VOLUNTEER_DETAILS,
  AFFECT_VOLUNTEER,
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
import { downloadCsv } from "~/utils/file/download.utils";
import { formatDate } from "@overbookd/time";
import { PERSONNE } from "@overbookd/team-constants";
import {
  DisplayModeBuilder,
  TROMBINOSCOPE,
  VOLUNTEER_LIST,
  VOLUNTEER_STATS,
  type DisplayMode,
} from "~/utils/user/volunteer.display";
import { CSVBuilder } from "@overbookd/csv";
import { formatPhoneNumber } from "@overbookd/registration";

useHead({ title: "Liste des bénévoles" });

const route = useRoute();
const myStore = useMyStore();
const userStore = useUserStore();
const availabilityStore = useVolunteerAvailabilityStore();

const canAssignVolunteer = computed<boolean>(() =>
  myStore.can(AFFECT_VOLUNTEER),
);

const volunteers = computed<UserDataWithPotentialyProfilePicture[]>(
  () => userStore.volunteers,
);
const allVolunteersLoading = ref<boolean>(volunteers.value.length === 0);
userStore.fetchVolunteers().then(() => (allVolunteersLoading.value = false));

const assignmentStatsLoading = ref<boolean>(
  userStore.volunteersWithAssignmentStats.length === 0,
);
const fetchAssignmentStatsIfNeeded = () => {
  if (
    !canAssignVolunteer.value ||
    displayMode.value !== VOLUNTEER_STATS ||
    userStore.volunteersWithAssignmentStats.length > 0
  )
    return;
  assignmentStatsLoading.value = true;
  userStore
    .fetchAllVolunteersWithAssignmentStats()
    .then(() => (assignmentStatsLoading.value = false));
};

const filters = ref<VolunteerFilters>({});
const displayMode = ref<DisplayMode>(TROMBINOSCOPE);
onMounted(() => {
  filters.value = VolunteerFilterBuilder.getFromRouteQuery(route.query);
  displayMode.value = DisplayModeBuilder.getFromRouteQuery(route.query);
  fetchAssignmentStatsIfNeeded();
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

const openVolunteerInfoDialog = (
  volunteer: UserDataWithPotentialyProfilePicture,
) => {
  if (!myStore.can(VIEW_VOLUNTEER_DETAILS)) return;
  userStore.setSelectedUser(volunteer);
  if (canAssignVolunteer.value) {
    availabilityStore.fetchVolunteerAvailabilities(volunteer.id);
  }
  isVolunteerInfoDialogOpen.value = true;
};
const closeVolunteerInfoDialog = () => {
  isVolunteerInfoDialogOpen.value = false;
};

const exportCSV = async () => {
  const csv = CSVBuilder.from(
    filteredVolunteers.value.map((volunteer) => {
      const teams = volunteer.teams
        .filter((team) => team !== PERSONNE)
        .join(", ");
      const birthDate = formatDate(volunteer.birthDate);
      const phoneNumber = formatPhoneNumber(volunteer.phoneNumber);
      return { ...volunteer, teams, phoneNumber, birthDate };
    }),
  )
    .select([
      "firstName",
      "lastName",
      "nickname",
      "charisma",
      "teams",
      "email",
      "birthDate",
      "phoneNumber",
      "comment",
      "note",
    ])
    .translate([
      ["firstName", "Prénom"],
      ["lastName", "Nom"],
      ["nickname", "Surnom"],
      ["charisma", "Charisme"],
      ["teams", "Équipes"],
      ["email", "Email"],
      ["birthDate", "Date de naissance"],
      ["phoneNumber", "Téléphone"],
      ["comment", "Commentaire"],
      ["note", "Note"],
    ])
    .build();

  downloadCsv("benevoles", csv);
};

const isDownloadLeafletsOpen = ref<boolean>(false);
const openDownloadLeafletsDialog = () => {
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
