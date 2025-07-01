<template>
  <div class="timeline-form">
    <v-card>
      <v-card-title>
        Plage horaire
        <v-btn
          icon="mdi-refresh"
          aria-label="Actualiser"
          title="Actualiser"
          color="secondary"
          density="comfortable"
          size="small"
          class="ml-1"
          @click="refreshToNow"
        />
      </v-card-title>
      <v-card-text class="card-content">
        <DateTimeField v-model="start" label="Début" hide-details />
        <DateTimeField v-model="end" label="Fin" hide-details />
        <v-btn
          text="Appliquer"
          color="primary"
          :loading="loading"
          @click="updateTimelineFilter"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Filtres </v-card-title>
      <v-card-text class="card-content">
        <v-text-field
          v-model="searchFieldModel"
          label="Nom de la tache"
          clear-icon="mdi-close-circle-outline"
          clearable
          hide-details
        />
        <SearchTeams
          v-model="teams"
          label="Filtrer par équipe"
          closable-chips
          hide-details
          @update:model-value="updateTeamsParam"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import {
  formatLocalDateTime,
  Period,
  type IProvidePeriod,
} from "@overbookd/time";
import type { Team } from "@overbookd/team";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { TimelineFilterBuilder } from "~/utils/timeline/timeline.filter";
import { useDebounceFn } from "@vueuse/core";

const timelineStore = useTimelineStore();

const loading = ref<boolean>(true);
timelineStore.fetchEvents().then(() => {
  loading.value = false;
});

const start = ref<Date>(timelineStore.start);
const end = ref<Date>(timelineStore.end);

const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));
const search = computed<string | null>({
  get: () => timelineStore.search,
  set: (value) => timelineStore.updateSearch(value),
});
const teams = computed<Team[]>({
  get: () => timelineStore.teams,
  set: (value) => timelineStore.updateTeams(value),
});

const updateTimelineFilter = async () => {
  try {
    Period.init(period.value);
  } catch {
    sendFailureNotification("La plage horaire est invalide");
    return;
  }
  loading.value = true;
  await timelineStore.updatePeriod(period.value);
  loading.value = false;

  await updateQueryParams("start", formatLocalDateTime(start.value));
  await updateQueryParams("end", formatLocalDateTime(end.value));
};
const refreshToNow = async () => {
  start.value = timelineStore.start;
  end.value = timelineStore.end;

  loading.value = true;
  await timelineStore.resetToDefaultPeriod();
  loading.value = false;

  await updateQueryParams("start", undefined);
  await updateQueryParams("end", undefined);
};

const searchFieldModel = computed<string | null>({
  get: () => search.value,
  set: (value) => updateSearchParam(value),
});

const updateSearchParam = useDebounceFn((newSearch: string | null) => {
  search.value = newSearch;
  updateQueryParams("search", newSearch);
}, 200);
const updateTeamsParam = (newTeams: Team[]) => {
  const teamsCode = newTeams.map(({ code }) => code);
  updateQueryParams("teams", teamsCode);
};

const route = useRoute();
onMounted(() => {
  const filters = TimelineFilterBuilder.getFromRouteQuery(route.query);
  if (filters.start || filters.end) {
    if (filters.start) start.value = filters.start;
    if (filters.end) end.value = filters.end;
    updateTimelineFilter();
  }
  if (filters.search) search.value = filters.search;
  if (filters.teams) teams.value = filters.teams;
});
</script>

<style lang="scss" scoped>
.timeline-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;

  .card-content {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 10px;

    > * {
      flex: 1;
    }

    @media screen and (max-width: $mobile-max-width) {
      gap: 10px;
      flex-direction: column;
      > * {
        width: 100%;
      }
    }
  }
}
</style>
