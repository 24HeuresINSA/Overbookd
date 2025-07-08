<template>
  <v-card>
    <v-card-title> Plage horaire et filtres </v-card-title>
    <v-card-text class="card-content">
      <div class="time-slot">
        <DateTimeField
          v-model="start"
          label="Début"
          hide-details
          @enter="updateNeedHelpPeriod"
        />
        <DateTimeField
          v-model="end"
          label="Fin"
          hide-details
          @enter="updateNeedHelpPeriod"
        />
        <v-btn
          text="Appliquer"
          color="secondary"
          :loading="loading"
          @click="updateNeedHelpPeriod"
        />
      </div>
      <v-divider />
      <div class="filters">
        <v-text-field
          v-model="searchFieldModel"
          label="Nom du bénévole"
          clear-icon="mdi-close-circle-outline"
          hide-details
          clearable
        />
        <SearchTeams
          v-model="teams"
          label="Filtrer par équipe"
          hide-details
          @update:model-value="updateTeamsParam"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import {
  formatLocalDateTime,
  Period,
  type IProvidePeriod,
} from "@overbookd/time";
import { useDebounceFn } from "@vueuse/core";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { NeedHelpFilterBuilder } from "~/utils/need-help/need-help.filter";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const needHelpStore = useNeedHelpStore();

const start = ref<Date>(needHelpStore.start);
const end = ref<Date>(needHelpStore.end);

const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));
const search = computed<string | null>({
  get: () => needHelpStore.search,
  set: (value: string | null) => {
    needHelpStore.updateSearch(value);
  },
});
const teams = computed<Team[]>({
  get: () => needHelpStore.teams,
  set: (value: Team[]) => needHelpStore.updateTeams(value),
});

const emit = defineEmits(["fetch"]);
const updateNeedHelpPeriod = async () => {
  try {
    Period.init(period.value);
  } catch {
    sendFailureNotification("La plage horaire est invalide");
    return;
  }
  needHelpStore.updatePeriod(period.value);
  emit("fetch");

  await updateQueryParams("start", formatLocalDateTime(start.value));
  await updateQueryParams("end", formatLocalDateTime(end.value));
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
  const filters = NeedHelpFilterBuilder.getFromRouteQuery(route.query);
  if (filters.start || filters.end) {
    if (filters.start) start.value = filters.start;
    if (filters.end) end.value = filters.end;
    updateNeedHelpPeriod();
  }
  if (filters.search) search.value = filters.search;
  if (filters.teams) teams.value = filters.teams;
});
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
}

.time-slot,
.filters {
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
</style>
