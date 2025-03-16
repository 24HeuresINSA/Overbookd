<template>
  <DesktopPageTitle />

  <div class="registrations">
    <v-card>
      <v-card-title>Briefing bénévole</v-card-title>
      <v-card-text>
        <p>
          Ajouter le créneau du briefing bénévole permet d'ajouter
          automatiquement la disponibilité aux bénévoles enrôlé·e·s.
        </p>
        <p class="important">
          {{ readableBriefingTimeWindow }}
        </p>
        <v-btn
          text="Enregistrer le créneau"
          color="primary"
          class="mt-2"
          :loading="briefingLoading"
          size="small"
          @click="openBriefingTimeWindowDialog"
        />
      </v-card-text>
    </v-card>

    <v-card>
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
              <v-tooltip
                v-model="showTooltip"
                location="top"
                open-delay="200"
                text="Recherchez par nom, prénom, surnom, email ou numéro de téléphone"
              >
                <template #activator="{ props }">
                  <v-text-field
                    v-model="filters.search"
                    v-bind="props"
                    label="Rechercher un candidat"
                    class="search-filter"
                    density="compact"
                    clearable
                    hide-details
                    @mouseenter="handleMouseEnter"
                    @click:clear="filters.search = ''"
                  />
                </template>
              </v-tooltip>
              <SearchTeams
                :model-value="filters.teams ?? []"
                label="Equipe(s)"
                density="compact"
                bg-color="surface"
                class="filters__field"
                closable-chips
                hide-details
                @update:model-value="updateTeamsParam"
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
              @click="openCandidateInfoDialog(item)"
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
  </div>

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

  <v-dialog v-model="isBriefingTimeWindowDialogOpen" max-width="600px">
    <UpsertPeriodDialogCard
      :existing-period="briefingTimeWindow"
      @add="saveBriefingTimeWindow"
      @update="saveBriefingTimeWindow"
      @close="closeBriefingTimeWindowDialog"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { VolunteerCandidate } from "@overbookd/http";
import { VOLUNTEER_BRIEFING_TIME_WINDOW_KEY } from "@overbookd/configuration";
import {
  formatDate,
  formatDateWithMinutes,
  type IProvidePeriod,
} from "@overbookd/time";
import type { Team } from "@overbookd/team";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import type { VolunteerFilters } from "~/utils/user/volunteer.filter";

useHead({ title: "Admissions bénévoles" });

const membershipApplicationStore = useMembershipApplicationStore();
const layoutStore = useLayoutStore();
const userStore = useUserStore();
const configurationStore = useConfigurationStore();
const showTooltip = ref<boolean>(false);

const headers = [
  { title: "Date de canidature", value: "candidatedAt", sortable: true },
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Surnom", value: "nickname", sortable: true },
  { title: "Email", value: "email" },
  { title: "Téléphone", value: "phone" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Équipes", value: "teams", sortable: true },
  { title: "Actions", value: "actions" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const filters = ref<VolunteerFilters>({
  search: "",
  teams: [],
});
const candidatesToEnroll = ref<VolunteerCandidate[]>([]);
const selectedCandidate = ref<VolunteerCandidate | undefined>();

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

  const searchTerm = filters.value.search?.toLocaleLowerCase() ?? "";
  const selectedTeams = filters.value.teams ?? [];

  const matching = matchingSearchItems(searchableCandidates, searchTerm);

  if (selectedTeams.length === 0) return matching;
  return matching.filter((candidate) => {
    return candidate.teams.some((team) =>
      selectedTeams.some((selectedTeam) => selectedTeam.code === team),
    );
  });
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
const isSelectedCandidateInCandidatesToEnroll = computed<boolean>(() =>
  selectedCandidate.value
    ? candidatesToEnroll.value.includes(selectedCandidate.value)
    : false,
);
const selectedUser = computed<UserDataWithPotentialyProfilePicture | undefined>(
  () => userStore.selectedUser,
);
const openCandidateInfoDialog = async (candidate: VolunteerCandidate) => {
  selectedCandidate.value = candidate;
  await userStore.findUserById(candidate.id);
  isCandidateInfoDialogOpen.value = true;
};
const closeCandidateInfoDialogue = () => {
  isCandidateInfoDialogOpen.value = false;
};

const updateTeamsParam = (teams: Team[]) => {
  filters.value.teams = teams;
  const teamsCode = teams.map(({ code }) => code);
  updateQueryParams("teams", teamsCode);
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

const briefingLoading = ref<boolean>(true);
configurationStore.fetch(VOLUNTEER_BRIEFING_TIME_WINDOW_KEY).then(() => {
  briefingLoading.value = false;
});
const briefingTimeWindow = computed<IProvidePeriod | null>(() => {
  const timeWindow = configurationStore.get(VOLUNTEER_BRIEFING_TIME_WINDOW_KEY);
  if (briefingLoading.value || !timeWindow) return null;
  const { start, end } = timeWindow as IProvidePeriod;
  return { start: new Date(start), end: new Date(end) };
});
const readableBriefingTimeWindow = computed<string>(() => {
  if (briefingLoading.value) return "";
  return briefingTimeWindow.value
    ? `Créneau du briefing bénévole : ${formatDateWithMinutes(briefingTimeWindow.value.start)} - ${formatDateWithMinutes(briefingTimeWindow.value.end)}`
    : "Le créneau du briefing bénévole n'est pas défini. Les disponibilités ne pourront donc pas être ajoutées.";
});
const isBriefingTimeWindowDialogOpen = ref<boolean>(false);
const openBriefingTimeWindowDialog = () => {
  isBriefingTimeWindowDialogOpen.value = true;
};
const closeBriefingTimeWindowDialog = () => {
  isBriefingTimeWindowDialogOpen.value = false;
};
const saveBriefingTimeWindow = async (period: IProvidePeriod) => {
  await configurationStore.save({
    key: VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
    value: period,
  });
};

const handleMouseEnter = () => {
  showTooltip.value = true;
  setTimeout(() => (showTooltip.value = false), 2000);
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
