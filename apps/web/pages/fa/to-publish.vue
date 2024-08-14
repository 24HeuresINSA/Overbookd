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
        :items-per-page="20"
        :mobile="isMobile"
        class="fa"
        @click:row="openActivity"
        @auxclick:row="openActivityInNewTab"
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
          <v-tooltip v-if="item.photoLink" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-camera"
                size="large"
                variant="flat"
                density="comfortable"
                @click.stop="openPhotoLinkInNewTab(item.photoLink)"
              />
            </template>
            {{ item.photoLink }}
          </v-tooltip>
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
            title="Animation phare"
          >
            mdi-check-circle
          </v-icon>
          <v-icon v-else color="red" size="large" title="Animation non phare">
            mdi-close-circle
          </v-icon>
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
  openActivity,
  openActivityInNewTab,
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
  { title: "Statut", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Photo", value: "photoLink", align: "center", width: "80px" },
  { title: "Description", value: "description" },
  { title: "Catégories", value: "categories" },
  { title: "Anim phare", value: "isFlagship", align: "center", width: "80px" },
  { title: "Créneaux", value: "timeWindows" },
];

const isMobile = computed<boolean>(() => !layoutStore.isDesktop);

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

const openPhotoLinkInNewTab = (photoLink: string) => {
  window.open(photoLink, "_blank");
};
</script>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  margin: 3px 0;
}
</style>
