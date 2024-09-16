<template>
  <DesktopPageTitle />
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredActivities"
        no-data-text="Aucun dispositif de sécurité ni de laissez-passer requis"
        :loading="loading"
        loading-text="Chargement des fiches activités..."
        :hover="filteredActivities.length > 0"
        :items-per-page="20"
        @click:row="openActivity"
        @auxclick:row="openActivityInNewTab"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Rechercher une activité"
            hide-details
          />
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
        </template>
        <template #item.start="{ item }">
          {{ displayDate(item.start) }}
        </template>
        <template #item.end="{ item }">
          {{ displayDate(item.end) }}
        </template>
        <template #item.timeWindowsCount="{ item }">
          {{ item.timeWindows.length }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewForSecurity } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import {
  formatDateToHumanReadable,
  type IProvidePeriod,
} from "@overbookd/time";
import {
  openActivity,
  openActivityInNewTab,
} from "~/utils/festival-event/open-page";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

useHead({ title: "Récapitulatif Sécurité" });

const faStore = useFestivalActivityStore();

const headers: TableHeaders = [
  { title: "Numéro", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Equipe responsable", value: "team", sortable: true },
  {
    title: "Début du premier créneau",
    value: "start",
    sortable: true,
    width: "200px",
  },
  {
    title: "Fin du dernier créneau",
    value: "end",
    sortable: true,
    width: "200px",
  },
  { title: "Créneaux", value: "timeWindowsCount" },
  { title: "Dispositif de sécurité", value: "specialNeeds" },
  { title: "Laissez-passer", value: "freePass", sortable: true },
];

type PreviewForSecurityWithGlobalTimeWindow = PreviewForSecurity &
  IProvidePeriod;

const activities = computed<PreviewForSecurityWithGlobalTimeWindow[]>(() =>
  faStore.activities.forSecurity.map((fa) => ({
    ...fa,
    start: startingTimeWindow(fa.timeWindows),
    end: endingTimeWindow(fa.timeWindows),
  })),
);
const loading = ref<boolean>(activities.value.length === 0);
faStore.fetchSecurityPreviews().then(() => (loading.value = false));

const search = ref<string>("");

const searchableActivities = computed<
  Searchable<PreviewForSecurityWithGlobalTimeWindow>[]
>(() =>
  activities.value.map((fa) => ({
    ...fa,
    searchable: SlugifyService.apply(`${fa.id} ${fa.name} ${fa.specialNeeds}`),
  })),
);
const filteredActivities = computed<PreviewForSecurityWithGlobalTimeWindow[]>(
  () => matchingSearchItems(searchableActivities.value, search.value),
);

const displayDate = (date: Date) => formatDateToHumanReadable(date);
const startingTimeWindow = (timeWindows: PreviewForSecurity["timeWindows"]) => {
  const starts = timeWindows.map(({ start }) => start);
  const minTimestamp = Math.min(...starts.map((end) => end.getTime()));
  return new Date(minTimestamp);
};
const endingTimeWindow = (timeWindows: PreviewForSecurity["timeWindows"]) => {
  const ends = timeWindows.map(({ end }) => end);
  const maxTimestamp = Math.max(...ends.map((end) => end.getTime()));
  return new Date(maxTimestamp);
};
</script>
