<template>
  <DialogCard @close="close">
    <template #title> Télécharger les livrets </template>

    <template #content>
      <div class="content">
        <v-alert
          v-show="isMaximumVolunteerLimitReached"
          icon="mdi-alert-circle"
          border="start"
          color="secondary"
          prominent
          closable
        >
          <h2 class="summary">
            Plus de {{ MAX_PLANNING_DOWNLOAD_IN_PARALLEL }} bénévoles
          </h2>
          <p class="catch-phrase">Ça fait beaucoup la non ?!</p>
          <p class="details">
            Le téléchargement risque de prendre beaucoup de temps et sera fait
            en plusieurs fois.
          </p>
        </v-alert>
        <SearchTeams
          v-model="teams"
          label="Équipe(s)"
          closable-chips
          hide-details
        />
        <v-text-field
          v-model="search"
          label="Recherche"
          hide-details
          clearable
        />
        <details>
          <summary>
            {{ displayedVolunteers.length }} bénévoles correspondant
          </summary>
          <v-data-table
            v-model:sort-by="sortBy"
            :headers="headers"
            :items="displayedVolunteers"
            no-data-text="Aucun bénévole correspondant"
            :mobile="isMobile"
          >
            <template #item.volunteer="{ item }">
              {{ buildUserNameWithNickname(item) }}
            </template>

            <template #item.teams="{ item }">
              <div class="team-list">
                <TeamChip
                  v-for="team of item.teams"
                  :key="team"
                  :team="team"
                  with-name
                />
              </div>
            </template>
          </v-data-table>
        </details>
      </div>
    </template>

    <template #actions>
      <v-btn
        color="primary"
        :loading="downloadInProgress"
        prepend-icon="mdi-download"
        size="x-large"
        @click="downloadAllPlannings"
      >
        Télécharger {{ displayedVolunteers.length }} plannings
      </v-btn>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import { buildUserNameWithNickname } from "@overbookd/user";
import { keepMembersOf } from "~/utils/search/search-team.utils";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import type { TableHeaders, SortItem } from "~/utils/vuetify/component-props";
import {
  compareVolunteersOnNames,
  compareVolunteersOnAssignment,
} from "~/utils/sort/sort-stats.utils";

const MAX_PLANNING_DOWNLOAD_IN_PARALLEL = 50;

const layoutStore = useLayoutStore();
const planningStore = usePlanningStore();
planningStore.fetchVolunteers();

const sortBy = ref<SortItem[]>([]);
const headers: TableHeaders = [
  {
    title: "Prénom Nom (Surnom)",
    value: "volunteer",
    sortable: true,
    sortRaw: compareVolunteersOnNames,
  },
  { title: "Équipes", value: "teams" },
  {
    title: "Affectaction",
    value: "assignment",
    width: "120px",
    sortable: true,
    sortRaw: compareVolunteersOnAssignment,
  },
];

const isMobile = computed<boolean>(() => layoutStore.isMobile);

const teams = ref<Team[]>([]);
const search = ref<string>("");
const volunteers = computed<Searchable<VolunteerForPlanning>[]>(() =>
  planningStore.volunteers.map((volunteer) =>
    toSearchable(volunteer as VolunteerForPlanning),
  ),
);
const displayedVolunteers = computed<VolunteerForPlanning[]>(() => {
  const isPartOfTeams = keepMembersOf(teams.value);
  const hasSimilarName = keepMatchingSearchCriteria(search.value);
  return volunteers.value.filter(
    (volunteer) => isPartOfTeams(volunteer) && hasSimilarName(volunteer),
  );
});
const isMaximumVolunteerLimitReached = computed<boolean>(
  () => displayedVolunteers.value.length > MAX_PLANNING_DOWNLOAD_IN_PARALLEL,
);

const downloadInProgress = ref<boolean>(false);
const downloadAllPlannings = async () => {
  downloadInProgress.value = true;
  await planningStore.downloadAllPdfPlannings(displayedVolunteers.value);
  downloadInProgress.value = false;
};

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
