<template>
  <DesktopPageTitle />

  <div class="dashboard">
    <v-card>
      <v-card-text class="dashboard__filters">
        <GearFilter
          v-model:search="gearFilters.search"
          v-model:category="gearFilters.category"
          v-model:team="gearFilters.team"
          @update:options="fetchActivities"
        />
        <div class="dashboard__filters-additional">
          <v-autocomplete
            v-model="gearFilters.drive"
            :items="drives"
            label="Lieu de stockage"
            hide-details
            clearable
            hide-selected
            no-data-text="Aucun lieu correspondant"
            @update:model-value="fetchActivities"
          />
          <v-text-field
            v-model="activitySearch"
            label="Rechercher une activité"
            hide-details
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
import { drives, type Drive } from "@overbookd/festival-event";
import type {
  ActivityGearSearchOptions,
  PreviewForLogistic,
} from "@overbookd/http";
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
const teamStore = useTeamStore();

const activityHeaders: TableHeaders = [
  { title: "Numéro", value: "id", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Equipe responsable", value: "team", sortable: true },
  { title: "Lien", value: "link", align: "center" },
];
const gearHeaders: TableHeaders = [
  { title: "Responsable", value: "owner", sortable: true },
  { title: "Catégorie", value: "category", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  { title: "Quantité", value: "quantity", sortable: true },
  { title: "Lieu de stockage", value: "drive", sortable: true },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const gearFilters = reactive<FilterGear & { drive?: Drive }>({
  search: "",
  category: undefined,
  team: undefined,
  drive: undefined,
});

const fetchActivities = async () => {
  loading.value = true;
  const options: ActivityGearSearchOptions = {
    search: gearFilters.search.trim() || undefined,
    category: gearFilters.category?.path,
    owner: gearFilters.team?.code,
    drive: gearFilters.drive,
  };
  await faStore.fetchLogisticPreviews(options);
  loading.value = false;
};

const activities = computed<PreviewForLogistic[]>(
  () => faStore.activities.forLogistic,
);
const loading = ref<boolean>(activities.value.length === 0);
fetchActivities();

const activitySearch = ref<string>("");

const searchableActivities = computed<Searchable<PreviewForLogistic>[]>(() =>
  activities.value.map((fa) => ({
    ...fa,
    searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
  })),
);
const filteredActivities = computed<PreviewForLogistic[]>(() =>
  matchingSearchItems(searchableActivities.value, activitySearch.value),
);

type CsvItem = {
  faId: number;
  faName: string;
  faStatus: string;
  faTeam?: string;
  owner?: string;
  category?: string;
  name: string;
  quantity: number;
  drive?: string;
  isPonctualUsage: boolean;
  isConsumable: boolean;
};
const exportCsv = async () => {
  const allInquiries: CsvItem[] = filteredActivities.value.flatMap(
    ({ id, name, status, team, inquiries }) => {
      const teamName = teamStore.getTeamByCode(team ?? "")?.name;
      const activity = {
        faId: id,
        faName: name,
        faStatus: status,
        faTeam: teamName,
      };
      return inquiries.map((inquiry) => ({
        ...activity,
        owner: inquiry.owner,
        category: inquiry.category,
        name: inquiry.name,
        quantity: inquiry.quantity,
        drive: inquiry.drive,
        isPonctualUsage: inquiry.isPonctualUsage,
        isConsumable: inquiry.isConsumable,
      }));
    },
  );

  const csv = CSVBuilder.from(allInquiries)
    .select([
      "faId",
      "faName",
      "faStatus",
      "faTeam",
      "owner",
      "category",
      "name",
      "quantity",
      "drive",
      "isPonctualUsage",
      "isConsumable",
    ])
    .translate([
      ["faId", "Numéro FA"],
      ["faName", "Nom FA"],
      ["faStatus", "Statut FA"],
      ["faTeam", "Equipe"],
      ["owner", "Responsable"],
      ["category", "Catégorie"],
      ["name", "Nom"],
      ["quantity", "Quantité"],
      ["drive", "Lieu de stockage"],
      ["isPonctualUsage", "Appoint"],
      ["isConsumable", "Consommable"],
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
