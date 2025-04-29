<template>
  <DesktopPageTitle />
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="activityHeaders"
        :items="filteredActivities"
        no-data-text="Aucune activité avec une demande de matériel"
        :loading="loading"
        loading-text="Chargement des fiches activités..."
        :hover="filteredActivities.length > 0"
        :mobile="isMobile"
        density="comfortable"
        class="fa"
        show-expand
        expand-on-click
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

        <template #item.link="{ item }">
          <v-btn
            icon="mdi-open-in-new"
            variant="flat"
            density="comfortable"
            @click.stop="openPageWithId($event, FA_URL, item.id)"
          />
        </template>

        <template #expanded-row="{ item }">
          <td :colspan="activityHeaders.length + 1">
            <v-data-table
              :headers="gearHeaders"
              :items="item.inquiries"
              no-data-text="Aucun matos demandé"
              :mobile="isMobile"
              density="compact"
              items-per-page="-1"
              hide-default-footer
            />
            <v-divider />
          </td>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewForLogistic } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { FA_URL } from "@overbookd/web-page";
import { openPageWithId } from "~/utils/navigation/router.utils";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

useHead({ title: "Demandes de matos FA" });

const faStore = useFestivalActivityStore();
const layoutStore = useLayoutStore();

const activityHeaders: TableHeaders = [
  { title: "Numéro", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Equipe responsable", value: "team", sortable: true },
  { title: "Lien", value: "link", align: "center" },
];
const gearHeaders: TableHeaders = [
  { title: "Responsable", value: "owner", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Quantité", value: "quantity", sortable: true },
  { title: "Lieu de stockage", value: "drive", sortable: true },
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
