<template>
  <v-card class="festival-event-filter">
    <v-card-title>Filtres</v-card-title>
    <v-card-text class="filters-input">
      <v-text-field
        :model-value="search"
        label="Recherche"
        clearable
        hide-details
        @update:model-value="updateSearchParam"
      />
      <SearchTeam
        v-model:team="team"
        label="Équipe"
        clearable
        hide-details
        @update:team="updateTeamParam"
      />
      <SearchUser
        v-model="adherent"
        :list="adherents"
        label="Bénévole"
        clearable
        hide-details
        @update:model-value="updateAdherentParam"
      />
      <v-select
        v-model="status"
        label="Statut"
        :items="statusWithLabels"
        item-value="key"
        item-title="label"
        hide-details
        @click:clear="clearStatus"
        @update:model-value="updateStatusParam"
      />

      <div>
        <slot name="additional-filters" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";
import type {
  FestivalActivity,
  FestivalTask,
  FestivalEventIdentifier,
} from "@overbookd/festival-event";
import {
  type FaStatusLabel,
  faStatusLabels,
} from "~/utils/festival-event/festival-activity/festival-activity.model";
import type { Team } from "@overbookd/team";
import type { User } from "@overbookd/user";
import type { FestivalEventStatus } from "~/utils/festival-event/festival-event.utils";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import {
  ADHERENT_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  STATUS_QUERY_PARAM,
  TEAM_QUERY_PARAM,
} from "~/utils/festival-event/festival-event.constant";
import {
  statusLabels as ftStatusLabels,
  type StatusLabel as FtStatusLabel,
} from "@overbookd/festival-event-constants";

const userStore = useUserStore();

const adherents = computed<User[]>(() => userStore.adherents);

const search = defineModel<string>("search", { required: false });
const team = defineModel<Team>("team", { required: false });
const adherent = defineModel<User>("adherent", { required: false });
const status = defineModel<FestivalEventStatus>("status", { required: false });

const { identifier } = defineProps({
  identifier: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FA",
  },
});

const isActivity = computed<boolean>(() => identifier === "FA");

type StatusLabels = (
  | { key: FestivalActivity["status"]; label: FaStatusLabel }
  | { key: FestivalTask["status"]; label: FtStatusLabel }
  | { key: null; label: "Tous" }
)[];
const statusWithLabels = computed<StatusLabels>(() => {
  const noneOfThem = { key: null, label: "Tous" } as const;
  const keyWithLabel = isActivity.value
    ? [...faStatusLabels.entries()]
    : [...ftStatusLabels.entries()];
  return [noneOfThem, ...keyWithLabel.map(([key, label]) => ({ key, label }))];
});
const clearStatus = () => (status.value = undefined);

const updateSearchParam = useDebounceFn((newSearch: string) => {
  search.value = newSearch;
  updateQueryParams(SEARCH_QUERY_PARAM, newSearch);
}, 200);
const updateTeamParam = (team?: Team) => {
  updateQueryParams(TEAM_QUERY_PARAM, team?.code);
};
const updateAdherentParam = (adherent?: User) => {
  updateQueryParams(ADHERENT_QUERY_PARAM, adherent?.id);
};
const updateStatusParam = (status: FestivalEventStatus | null) => {
  updateQueryParams(STATUS_QUERY_PARAM, status);
};
</script>

<style scoped>
.festival-event-filter {
  height: fit-content;
  max-width: 350px;
}

.filters-input {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
</style>
