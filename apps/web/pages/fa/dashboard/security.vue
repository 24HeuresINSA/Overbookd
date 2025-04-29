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
        :mobile="isMobile"
        class="fa"
        density="comfortable"
        @click:row="openActivityFromDataTable"
        @auxclick:row="openActivityInNewTabFromDataTable"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Rechercher une activité"
            hide-details
          />
        </template>

        <template #item.id="{ item }">
          <div class="status">
            <v-chip :class="item.status.toLowerCase()">
              {{ item.id }}
            </v-chip>
          </div>
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
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
import { formatDateToHumanReadable } from "@overbookd/time";
import {
  openActivityFromDataTable,
  openActivityInNewTabFromDataTable,
} from "~/utils/festival-event/open-page";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

useHead({ title: "Récapitulatif Sécurité" });

const faStore = useFestivalActivityStore();
const layoutStore = useLayoutStore();

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
const isMobile = computed<boolean>(() => layoutStore.isMobile);

type PreviewForSecurityWithDisplayableTimeWindow = PreviewForSecurity & {
  start?: string;
  end?: string;
};

const activities = computed<PreviewForSecurityWithDisplayableTimeWindow[]>(() =>
  faStore.activities.forSecurity.map((fa) => {
    if (fa.timeWindows.length === 0) return fa;
    return {
      ...fa,
      start: displayableTimeWindowStart(fa.timeWindows),
      end: displayableTimeWindowEnd(fa.timeWindows),
    };
  }),
);
const loading = ref<boolean>(activities.value.length === 0);
faStore.fetchSecurityPreviews().then(() => (loading.value = false));

const search = ref<string>("");

const searchableActivities = computed<
  Searchable<PreviewForSecurityWithDisplayableTimeWindow>[]
>(() =>
  activities.value.map((fa) => ({
    ...fa,
    searchable: SlugifyService.apply(`${fa.id} ${fa.name} ${fa.specialNeeds}`),
  })),
);
const filteredActivities = computed<
  PreviewForSecurityWithDisplayableTimeWindow[]
>(() => matchingSearchItems(searchableActivities.value, search.value));

const displayableTimeWindowStart = (
  timeWindows: PreviewForSecurity["timeWindows"],
): string => {
  const starts = timeWindows.map(({ start }) => start);
  const minTimestamp = Math.min(...starts.map((end) => end.getTime()));
  return formatDateToHumanReadable(new Date(minTimestamp));
};
const displayableTimeWindowEnd = (
  timeWindows: PreviewForSecurity["timeWindows"],
): string => {
  const ends = timeWindows.map(({ end }) => end);
  const maxTimestamp = Math.max(...ends.map((end) => end.getTime()));
  return formatDateToHumanReadable(new Date(maxTimestamp));
};
</script>
