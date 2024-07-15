<template>
  <v-card class="festival-event-filter">
    <v-card-title>Filtres</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="search"
        label="Recherche"
        clearable
        @update:model-value="updateSearchParam"
      />
      <SearchTeam
        v-model="team"
        label="Équipe"
        clearable
        @update:model-value="updateTeamParam"
      />
      <SearchUser
        v-model="adherent"
        :list="adherents"
        label="Bénévole"
        clearable
        @update:model-value="updateAdherentParam"
      />
      <v-select
        v-model="status"
        label="Statut"
        :items="statusWithLabels"
        item-value="key"
        item-title="label"
        clearable
        @click:clear="clearStatus"
        @update:model-value="updateStatusParam"
      />

      <slot name="additional-filters" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
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
import {
  type FtStatusLabel,
  ftStatusLabels,
} from "~/utils/festival-event/festival-task/festival-task.model";
import type { FestivalEventStatus } from "~/utils/festival-event/festival-event.utils";
import { updateQueryParams } from "~/utils/http/url-params.utils";

const userStore = useUserStore();

await userStore.fetchAdherents();
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

const isActivity = computed(() => identifier === "FA");

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

const updateSearchParam = (search: string) => {
  updateQueryParams("search", search);
};
const updateTeamParam = (team?: Team) => {
  updateQueryParams("team", team?.code);
};
const updateAdherentParam = (adherent?: User) => {
  updateQueryParams("adherent", adherent?.id);
};
const updateStatusParam = (status: FestivalEventStatus) => {
  updateQueryParams("status", status);
};
</script>

<style lang="scss" scoped>
.festival-event-filter {
  height: fit-content;
}
</style>
