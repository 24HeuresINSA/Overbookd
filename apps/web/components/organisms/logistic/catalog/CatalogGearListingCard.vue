<template>
  <v-card>
    <v-card-text>
      <div class="filters-container">
        <GearFilter
          v-model:search="filters.search"
          v-model:category="filters.category"
          v-model:team="filters.team"
          @update:options="searchGears"
        />
        <v-btn
          v-if="isCatalogWriter"
          text="Ajouter"
          prepend-icon="mdi-plus"
          color="primary"
          class="add-button"
          @click="openCreateGearDialog"
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
        :name="filters.search"
        :category="filters.category"
        :loading="loading"
        loading-text="Chargement du matos..."
        no-data-text="Aucun matos trouvé"
        :mobile="isMobile"
      >
        <template #item.isPonctualUsage="{ item }">
          <v-icon
            v-if="item.isPonctualUsage"
            icon="mdi-check-circle"
            aria-label="Est du matos d'appoint"
            title="Est du matos d'appoint"
          />
        </template>

        <template #item.isConsumable="{ item }">
          <v-icon
            v-if="item.isConsumable"
            icon="mdi-check-circle"
            aria-label="Est du matos consommable"
            title="Est du matos consommable"
          />
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
            aria-label="Éditer le matos"
            title="Éditer le matos"
            size="small"
            variant="flat"
            @click="openUpdateGearDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            aria-label="Supprimer le matos"
            title="Supprimer le matos"
            size="small"
            variant="flat"
            @click="openDeleteGearDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>

    <v-dialog
      v-model="isUpsertGearDialogOpen"
      width="600px"
      @after-leave="emptySelectedGear"
    >
      <CatalogGearFormDialogCard
        :gear="selectedGear"
        @close="closeUpsertGearDialog"
      />
    </v-dialog>

    <v-dialog
      v-model="isDeleteGearDialogOpen"
      width="600px"
      @after-leave="emptySelectedGear"
    >
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
import { downloadCsv } from "~/utils/file/download.utils";
import { booleanToReadableString } from "~/utils/file/csv.utils";
import { CSVBuilder } from "@overbookd/csv";

const catalogGearStore = useCatalogGearStore();
const userStore = useUserStore();
const layoutStore = useLayoutStore();

const isCatalogWriter = computed<boolean>(() =>
  userStore.can(WRITE_GEAR_CATALOG),
);
const headers = computed<TableHeaders>(() => {
  const commonHeaders = [
    { title: "Matos", value: "name", sortable: true, width: "30%" },
    { title: "Référence", value: "code", sortable: true, width: "10%" },
    {
      title: "Matos d'appoint",
      value: "isPonctualUsage",
      align: "center",
      sortable: true,
    },
    {
      title: "Matos consommable",
      value: "isConsumable",
      align: "center",
      sortable: true,
    },
    { title: "Catégorie", value: "category", width: "20%" },
  ];
  const actionsHeader = { title: "Actions", value: "actions" };
  return isCatalogWriter.value
    ? [...commonHeaders, actionsHeader]
    : commonHeaders;
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const filters = reactive<FilterGear>({
  search: "",
  category: undefined,
  team: undefined,
});

const gears = computed<CatalogGear[]>(() => catalogGearStore.gears);

const loading = ref<boolean>(gears.value.length === 0);
catalogGearStore.fetchGears({}).then(() => (loading.value = false));

const selectedGear = ref<CatalogGear>();

const searchGears = (options: GearSearchOptions) => {
  loading.value = true;
  catalogGearStore.fetchGears(options).then(() => (loading.value = false));
};

const isUpsertGearDialogOpen = ref<boolean>(false);
const openCreateGearDialog = () => (isUpsertGearDialogOpen.value = true);
const openUpdateGearDialog = (gear: CatalogGear) => {
  selectedGear.value = gear;
  isUpsertGearDialogOpen.value = true;
};
const closeUpsertGearDialog = () => {
  isUpsertGearDialogOpen.value = false;
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

const emptySelectedGear = () => (selectedGear.value = undefined);

const exportCatalogCSV = async () => {
  if (!isCatalogWriter.value) return;

  const csv = CSVBuilder.from(
    gears.value.map((gear) => {
      const category = gear.category ?? { name: "", path: "" };
      const isConsumable = booleanToReadableString(gear.isConsumable);
      const isPonctualUsage = booleanToReadableString(gear.isPonctualUsage);
      return { ...gear, category, isConsumable, isPonctualUsage };
    }),
  )
    .select([
      "code",
      "category.name",
      "category.path",
      "name",
      "isConsumable",
      "isPonctualUsage",
    ])
    .translate([
      ["code", "Référence"],
      ["category.name", "Catégorie"],
      ["category.path", "Catégorie complète"],
      ["name", "Materiel"],
      ["isConsumable", "Consommable"],
      ["isPonctualUsage", "Appoint"],
    ])
    .build();

  downloadCsv("catalogue", csv);
};
</script>

<style lang="scss" scoped>
.filters-container {
  width: 100%;
  display: flex;
  gap: 15px;
  align-items: center;
  @media (max-width: $mobile-max-width) {
    flex-direction: column-reverse;
    gap: 10px;
    .add-button {
      width: 100%;
    }
  }
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
