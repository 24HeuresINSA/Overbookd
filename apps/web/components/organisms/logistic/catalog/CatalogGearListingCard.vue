<template>
  <v-card>
    <v-card-text>
      <div class="filters">
        <GearFilter
          v-model:name="filters.name"
          v-model:category="filters.category"
          v-model:team="filters.team"
          @update:options="searchGears"
        />
        <v-btn
          v-if="isCatalogWriter"
          text="Exporter"
          prepend-icon="mdi-export"
          color="secondary"
          class="desktop-only"
          @click="exportCatalogCSV"
        />
      </div>
      <v-data-table
        :headers="headers"
        :items="gears"
        :name="filters.name"
        :category="filters.category"
        :loading="loading"
        loading-text="Chargement du matos..."
        no-data-text="Aucun matos trouvé"
        :mobile="isMobile"
      >
        <template #item.isPonctualUsage="{ item }">
          <v-icon v-if="item.isPonctualUsage" icon="mdi-check-circle" />
        </template>

        <template #item.isConsumable="{ item }">
          <v-icon v-if="item.isConsumable" icon="mdi-check-circle" />
        </template>

        <template #item.category="{ item }">
          <div v-show="item.category" class="category-details">
            <span class="category-details__name">{{
              item.category?.name
            }}</span>
            <span class="category-details__path">
              {{ item.category?.path }}
            </span>
          </div>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="flat"
            @click="openUpdateGearDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click="openDeleteGearDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog v-model="isUpdateGearDialogOpen" width="600px">
      <CatalogGearFormDialogCard
        :gear="selectedGear"
        @close="closeUpdateGearDialog"
      />
    </v-dialog>

    <v-dialog v-model="isDeleteGearDialogOpen" width="600px">
      <ConfirmationDialogCard
        confirm-color="error"
        @close="closeDeleteGearDialog"
        @confirm="deleteGear"
      >
        <template #title>Suppression du matos</template>
        <template #statement>
          Tu es sur le point de supprimer
          <strong>{{ selectedGear?.name }}.</strong>
          Tu devrais vérifier que ce matos n'est pas utilisé quelque part avant
          de faire ça.
        </template>
        <template #confirm-btn-content>
          <v-icon left> mdi-trash-can </v-icon>Supprimer
        </template>
      </ConfirmationDialogCard>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import type { CatalogGear, GearSearchOptions } from "@overbookd/http";
import { WRITE_GEAR_CATALOG } from "@overbookd/permission";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import type { FilterGear } from "~/utils/logistic/filter-gear";
import { download } from "~/utils/file/download.utils";
import {
  sanitizeFieldForCSV,
  booleanToReadableString,
} from "~/utils/file/csv.utils";

const catalogGearStore = useCatalogGearStore();
const userStore = useUserStore();
const layoutStore = useLayoutStore();

const isCatalogWriter = computed<boolean>(() =>
  userStore.can(WRITE_GEAR_CATALOG),
);
const headers = computed<TableHeaders>(() => {
  const commonHeaders = [
    { title: "Matos", value: "name", sortable: true },
    { title: "Référence", value: "code", sortable: true },
    { title: "Matos d'appoint", value: "isPonctualUsage", sortable: true },
    { title: "Matos consommable", value: "isConsumable", sortable: true },
    { title: "Catégorie", value: "category" },
  ];
  const actionsHeader = { title: "Actions", value: "actions" };
  return isCatalogWriter.value
    ? [...commonHeaders, actionsHeader]
    : commonHeaders;
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const filters = reactive<FilterGear>({
  name: "",
  category: undefined,
  team: undefined,
});

const gears = computed<CatalogGear[]>(() => catalogGearStore.gears);

const loading = ref<boolean>(gears.value.length === 0);
catalogGearStore.fetchGears({}).then(() => (loading.value = false));

const selectedGear = ref<CatalogGear | undefined>();

const searchGears = async (options: GearSearchOptions) => {
  loading.value = true;
  catalogGearStore.fetchGears(options).then(() => (loading.value = false));
};

const isUpdateGearDialogOpen = ref<boolean>(false);
const openUpdateGearDialog = (gear: CatalogGear) => {
  selectedGear.value = gear;
  isUpdateGearDialogOpen.value = true;
};
const closeUpdateGearDialog = () => {
  isUpdateGearDialogOpen.value = false;
};

const isDeleteGearDialogOpen = ref<boolean>(false);
const openDeleteGearDialog = (gear: CatalogGear) => {
  selectedGear.value = gear;
  isDeleteGearDialogOpen.value = true;
};
const closeDeleteGearDialog = () => {
  isDeleteGearDialogOpen.value = false;
};
const deleteGear = async () => {
  if (!selectedGear.value) return;
  await catalogGearStore.deleteGear(selectedGear.value);
  closeDeleteGearDialog();
};

const exportCatalogCSV = async () => {
  if (!isCatalogWriter.value) return;

  const csvHeader = "Référence;Catégorie;Nom;Consommable;Appoint";
  const csvContent = gears.value.map((gear) => {
    const category = gear.category
      ? `${gear.category.name} (${gear.category.path})`
      : "";
    return [
      gear.code ?? "",
      category,
      gear.name,
      booleanToReadableString(gear.isConsumable),
      booleanToReadableString(gear.isPonctualUsage),
    ]
      .map(sanitizeFieldForCSV)
      .join(";");
  });

  const csv = [csvHeader, ...csvContent].join("\n");
  download("catalogue.csv", csv);
};
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  display: flex;
  gap: 15px;
  align-items: center;
}

.category-details {
  display: flex;
  flex-direction: column;
  gap: 1px;
  margin: 0;
  &__path {
    font-size: 0.8rem;
    color: gray;
  }
}
</style>
