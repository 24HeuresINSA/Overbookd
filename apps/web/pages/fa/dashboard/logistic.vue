<template>
  <DesktopPageTitle />

  <div class="dashboard">
    <v-card>
      <v-card-text class="dashboard__filters">
        <GearFilter
          v-model:search="filters.search"
          v-model:category="filters.category"
          v-model:team="filters.team"
          @update:options="searchActivities"
        />
        <div class="dashboard__filters-additional">
          <v-autocomplete
            v-model="filters.storage"
            :items="storages"
            label="Lieu de stockage"
            hide-details
            clearable
            hide-selected
            no-data-text="Aucun lieu correspondant"
            @update:model-value="searchActivities"
          />
          <v-text-field
            v-model="search"
            label="Rechercher une activité"
            hide-details
            @update:model-value="searchActivities"
          />
          <v-btn
            prepend-icon="mdi-export"
            text="Exporter les FA affichées"
            color="secondary"
            @click="exportCsv"
          />
        </div>
      </v-card-text>
    </v-card>
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
  </div>
</template>

<script lang="ts" setup>
import { CSVBuilder } from "@overbookd/csv";
import type { PreviewForLogistic } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { FA_URL } from "@overbookd/web-page";
import { downloadCsv } from "~/utils/file/download.utils";
import type { FilterGear } from "~/utils/logistic/filter-gear";
import { openPageWithId } from "~/utils/navigation/router.utils";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

useHead({ title: "Demandes de matos FA" });

const faStore = useFestivalActivityStore();
const layoutStore = useLayoutStore();
const inventoryStore = useInventoryStore();
const teamStore = useTeamStore();

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

const filters = reactive<FilterGear>({
  search: "",
  category: undefined,
  team: undefined,
  storage: undefined,
});

inventoryStore.fetchStorages();
const storages = computed<string[]>(() => inventoryStore.storages);

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

const searchActivities = () => {
  console.log("searchActivities", filters);
};

type CsvItem = {
  faId: string;
  faName: string;
  faStatus: string;
  faTeam: string;
  owner: string;
  name: string;
  quantity: number;
  drive: string;
};
const exportCsv = async () => {
  const allInquiries: CsvItem[] = filteredActivities.value.flatMap((activity) =>
    activity.inquiries.map((inquiry) => ({
      faId: activity.id,
      faName: activity.name,
      faStatus: activity.status,
      faTeam: teamStore.getTeamByCode(activity.team)?.name ?? "",
      ...inquiry,
    })),
  );

  const csv = CSVBuilder.from(allInquiries)
    .select([
      "faId",
      "faName",
      "faStatus",
      "faTeam",
      "owner",
      "name",
      "quantity",
      "drive",
    ])
    .translate([
      ["faId", "Numéro FA"],
      ["faName", "Nom FA"],
      ["faStatus", "Statut FA"],
      ["faTeam", "Equipe"],
      ["owner", "Responsable"],
      ["name", "Nom"],
      ["quantity", "Quantité"],
      ["drive", "Lieu de stockage"],
    ])
    .build();
  downloadCsv("demandes-matos-FA", csv);
};
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: $card-gap;

  &__filters {
    display: flex;
    flex-direction: column;
    gap: 10px;
    &-additional {
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }
}
</style>
