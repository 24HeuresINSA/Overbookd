<template>
  <DesktopPageTitle />
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="tableHeaders"
        :items="filteredActivities"
        :loading="loading"
        loading-text="Chargement des animations à publier..."
        no-data-text="Aucune animation à publier"
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
            label="Rechercher une animation"
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

        <template #item.photoLink="{ item }">
          <v-btn
            v-if="item.photoLink"
            v-tooltip:top="item.photoLink"
            icon="mdi-camera"
            aria-label="Voir la photo de l'activité"
            size="large"
            variant="flat"
            density="comfortable"
            @click.stop="openPhotoLinkInNewTab(item.photoLink)"
          />
        </template>

        <template #item.description="{ item }">
          <div v-html-safe="item.description" />
        </template>

        <template #item.categories="{ item }">
          <div class="chips">
            <v-chip v-for="category in item.categories" :key="category">
              {{ category }}
            </v-chip>
          </div>
        </template>

        <template #item.isFlagship="{ item }">
          <v-icon
            v-if="item.isFlagship"
            color="green"
            size="large"
            icon="mdi-check-circle"
            aria-label="Animation phare"
            title="Animation phare"
          />
          <v-icon
            v-else
            color="red"
            size="large"
            icon="mdi-close-circle"
            aria-label="Animation non phare"
            title="Animation non phare"
          />
        </template>

        <template #item.timeWindows="{ item }">
          <div class="chips">
            <v-chip
              v-for="timeWindow in sortTimeWindows(item.timeWindows)"
              :key="timeWindow.id"
            >
              {{ formatDateWithMinutes(timeWindow.start) }} -
              {{ formatDateWithMinutes(timeWindow.end) }}
            </v-chip>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewForCommunication } from "@overbookd/http";
import type { TimeWindow } from "@overbookd/festival-event";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { Period, formatDateWithMinutes } from "@overbookd/time";
import {
  openActivityFromDataTable,
  openActivityInNewTabFromDataTable,
} from "~/utils/festival-event/open-page";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { SlugifyService } from "@overbookd/slugify";

useHead({ title: "Animations à publier" });

const faStore = useFestivalActivityStore();
const layoutStore = useLayoutStore();

const tableHeaders: TableHeaders = [
  { title: "Numéro", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Photo", value: "photoLink", align: "center", width: "80px" },
  { title: "Description", value: "description" },
  { title: "Catégories", value: "categories" },
  {
    title: "Anim phare",
    value: "isFlagship",
    align: "center",
    width: "80px",
    sortable: true,
  },
  { title: "Créneaux", value: "timeWindows" },
];

const isMobile = computed<boolean>(() => layoutStore.isMobile);

const activities = computed<PreviewForCommunication[]>(
  () => faStore.activities.forCommunication,
);
const loading = ref<boolean>(activities.value.length === 0);
faStore.fetchCommunicationPreviews().then(() => (loading.value = false));

const search = ref<string>("");

const searchableActivities = computed<Searchable<PreviewForCommunication>[]>(
  () =>
    activities.value.map((fa) => ({
      ...fa,
      searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
    })),
);
const filteredActivities = computed<PreviewForCommunication[]>(() =>
  matchingSearchItems(searchableActivities.value, search.value),
);

const sortTimeWindows = (timeWindows: TimeWindow[]): TimeWindow[] => {
  return Period.sort([...timeWindows]);
};

const openPhotoLinkInNewTab = (photoLink: string) => window.open(photoLink);
</script>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin: 3px 0;
}
</style>
