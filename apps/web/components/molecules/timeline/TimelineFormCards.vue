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
        <DateTimeField
          v-model="start"
          label="Début"
          hide-details
          @enter="updatePeriod()"
        />
        <DateTimeField
          v-model="end"
          label="Fin"
          hide-details
          @enter="updatePeriod()"
        />
        <v-btn
          text="Appliquer"
          color="primary"
          :loading="loading"
          @click="updatePeriod"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Filtres </v-card-title>
      <v-card-text class="card-content">
        <v-text-field
          v-model="searchFieldModel"
          :label="isTimeline ? 'Nom de la tache' : 'Nom du bénévole'"
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
import { isTimelineMode } from "~/utils/timeline/mode";

const route = useRoute();
const isTimeline = isTimelineMode(route.path);

const store = isTimeline ? useTimelineStore() : useNeedHelpStore();

const loading = defineModel<boolean>("loading", { default: false });

const start = ref<Date>(store.start);
const end = ref<Date>(store.end);

const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));
const search = computed<string | null>({
  get: () => store.search,
  set: (value) => store.updateSearch(value),
});
const teams = computed<Team[]>({
  get: () => store.teams,
  set: (value) => store.updateTeams(value),
});

const emit = defineEmits(["apply"]);

const updatePeriod = async () => {
  try {
    Period.init(period.value);
  } catch {
    sendFailureNotification("La plage horaire est invalide");
    return;
  }
  loading.value = true;
  await store.updatePeriod(period.value);
  emit("apply");

  await updateQueryParams("start", formatLocalDateTime(start.value));
  await updateQueryParams("end", formatLocalDateTime(end.value));
  loading.value = false;
};
const refreshToNow = async () => {
  loading.value = true;
  await store.resetToDefaultPeriod();
  start.value = store.start;
  end.value = store.end;
  emit("apply");

  await updateQueryParams("start", undefined);
  await updateQueryParams("end", undefined);
  loading.value = false;
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

onMounted(() => {
  const filters = TimelineFilterBuilder.getFromRouteQuery(route.query);
  if (filters.start || filters.end) {
    if (filters.start) start.value = filters.start;
    if (filters.end) end.value = filters.end;
    updatePeriod();
  } else {
    refreshToNow();
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

    > *:not(.v-btn) {
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
