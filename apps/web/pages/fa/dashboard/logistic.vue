<template>
  <DesktopPageTitle />
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredActivities"
        no-data-text="Aucune activité avec une demande de matériel"
        :loading="loading"
        loading-text="Chargement des fiches activités..."
        :hover="filteredActivities.length > 0"
        :mobile="isMobile"
        class="fa"
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
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewForLogistic } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
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
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const activities = computed<PreviewForLogistic[]>(
  () => faStore.activities.forLogistic,
);
const loading = ref<boolean>(activities.value.length === 0);
faStore.fetchLogisticPreviews().then(() => (loading.value = false));

const search = ref<string>("");

const searchableActivities = computed<Searchable<PreviewForLogistic>[]>(() =>
  activities.value.map((fa) => ({
    ...fa,
    searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
  })),
);
const filteredActivities = computed<PreviewForLogistic[]>(() =>
  matchingSearchItems(searchableActivities.value, search.value),
);
</script>
