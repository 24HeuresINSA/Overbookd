<template>
  <DesktopPageTitle />
  <div class="orga-need">
    <v-card>
      <v-card-title>Plage horaire et filtre</v-card-title>
      <v-card-text class="filters">
        <div class="filters__period">
          <DateTimeField
            v-model="start"
            label="Début du créneau"
            hide-details
          />
          <DateTimeField v-model="end" label="Fin du créneau" hide-details />
          <v-btn
            text="Appliquer"
            color="primary"
            :loading="loading"
            @click="fetchStats"
          />
        </div>

        <v-divider class="desktop-only" vertical />

        <SearchTeams
          v-model="teams"
          class="filters__teams"
          hide-details
          @update:model-value="updateTeams"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <OrgaNeedChart @select:details="selectDetails" />
      </v-card-text>
    </v-card>
  </div>

  <v-dialog v-model="isDetailsOpen" max-width="1000px">
    <OrgaNeedDetailsDialogCard
      v-if="selectedDetails"
      :details="selectedDetails"
      :filter-teams="teamCodes"
      @close="closeDetails"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import { ONE_DAY_IN_MS, Period } from "@overbookd/time";
import type { OrgaNeedDetails } from "@overbookd/http";
import type { Team } from "@overbookd/team";

useHead({ title: "Besoin orgas" });

const configurationStore = useConfigurationStore();
const orgaNeedStore = useOrgaNeedStore();

const stats = computed<OrgaNeedDetails[]>(() => orgaNeedStore.stats);

const FOUR_DAYS_IN_MS = 4 * ONE_DAY_IN_MS;

const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(new Date(start.value.getTime() + FOUR_DAYS_IN_MS));

const teamCodes = computed<string[]>(() => teams.value.map(({ code }) => code));
const teams = ref<Team[]>([]);
const updateTeams = async (newTeams: Team[]) => {
  teams.value = newTeams;
  await fetchStats();
};

const loading = ref<boolean>(false);
const fetchStats = async () => {
  const period = { start: start.value, end: end.value };
  try {
    Period.init(period);
  } catch (_error) {
    sendFailureNotification("La plage horaire est invalide");
    return;
  }
  loading.value = true;
  await orgaNeedStore.fetchStats(period, teamCodes.value);
  loading.value = false;
};
fetchStats();

const isDetailsOpen = ref<boolean>(false);
const selectedDetails = ref<OrgaNeedDetails | undefined>();
const selectDetails = (index: number) => {
  const details = stats.value.at(index);
  if (details === undefined) return;
  selectedDetails.value = details;
  isDetailsOpen.value = true;
};
const closeDetails = () => {
  isDetailsOpen.value = false;
  selectedDetails.value = undefined;
};
</script>

<style lang="scss" scoped>
.orga-need {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.filters {
  display: flex;
  gap: 20px;
  margin-top: 5px;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 10px;
  }
  &__period {
    display: flex;
    gap: 15px;
    align-items: center;
    @media only screen and (max-width: $mobile-max-width) {
      flex-direction: column;
      gap: 10px;
      * {
        width: 100%;
      }
    }
  }
}
</style>
