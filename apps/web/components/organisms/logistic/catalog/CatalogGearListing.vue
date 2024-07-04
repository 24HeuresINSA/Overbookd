<template>
  <div>
    <h2>Matos</h2>
    <GearFilter
      v-model:name="filters.name"
      v-model:category="filters.category"
      v-model:team="filters.team"
    />
    <v-data-table
      :headers="headers"
      :items="gears"
      :name="filters.name"
      :category="filters.category"
      :loading="loading"
      loading-text="Chargement du matos..."
      no-data-text="Aucun matos trouvé"
    >
      <template #item.isPonctualUsage="{ item }">
        <v-icon v-if="item.isPonctualUsage" icon="mdi-check-circle" />
      </template>

      <template #item.isConsumable="{ item }">
        <v-icon v-if="item.isConsumable" icon="mdi-check-circle" />
      </template>

      <template #item.category="{ item }">
        <div v-show="item.category" class="category-details">
          <span class="category-details__name">{{ item.category?.name }}</span>
          <span class="category-details__path"> {{ item.category?.path }}</span>
        </div>
      </template>

      <template #item.actions="{ item }">
        <div class="actions">
          <v-btn
            icon="mdi-pencil"
            size="small"
            @click="openUpdateGearDialog(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            @click="openDeleteGearDialog(item)"
          />
        </div>
      </template>
    </v-data-table>

    <v-dialog v-model="isUpdateGearDialogOpen" width="600px">
      <CatalogGearForm :gear="selectedGear" @close="closeUpdateGearDialog" />
    </v-dialog>

    <v-dialog v-model="isDeleteGearDialogOpen" width="600px">
      <ConfirmationMessage
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
          <v-icon left> mdi-delete </v-icon>Supprimer
        </template>
      </ConfirmationMessage>
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type { CatalogGear, GearSearchOptions } from "@overbookd/http";
import { WRITE_GEAR_CATALOG } from "@overbookd/permission";
import type { TableHeaders } from "~/utils/data-table/header";
import type { FilterGear } from "~/utils/logistic/filter-gear";

const catalogGearStore = useCatalogGearStore();
const userStore = useUserStore();

const isCatalogWriter = computed(() => userStore.can(WRITE_GEAR_CATALOG));
const actionHeader = computed(() =>
  isCatalogWriter
    ? { title: "Actions", value: "actions", sortable: false }
    : {},
);
const headers = computed<TableHeaders>(() => [
  { title: "Matos", value: "name", sortable: true },
  { title: "Référence", value: "code", sortable: true },
  { title: "Matos d'appoint", value: "isPonctualUsage", sortable: true },
  { title: "Matos consommable", value: "isConsumable", sortable: true },
  { title: "Catégorie", value: "category" },
  actionHeader.value,
]);

const filters = reactive<FilterGear>({
  name: "",
  category: undefined,
  team: undefined,
});

const gears = computed<CatalogGear[]>(() => catalogGearStore.gears);

const loading = ref(gears.value.length === 0);
catalogGearStore.fetchGears({}).then(() => (loading.value = false));

const selectedGear = ref<CatalogGear | undefined>();

const buildSearchOptions = (): GearSearchOptions => {
  const name = filters.name ? { name: filters.name } : {};
  const category = filters.category ? { category: filters.category.path } : {};
  const team = filters.team ? { owner: filters.team.code } : {};
  return { ...name, ...category, ...team };
};
const searchGears = async () => {
  const searchOptions = buildSearchOptions();
  loading.value = true;
  catalogGearStore
    .fetchGears(searchOptions)
    .then(() => (loading.value = false));
};
watch(filters, searchGears, { deep: true });

const isUpdateGearDialogOpen = ref(false);
const openUpdateGearDialog = (gear: CatalogGear) => {
  selectedGear.value = gear;
  isUpdateGearDialogOpen.value = true;
};
const closeUpdateGearDialog = () => {
  isUpdateGearDialogOpen.value = false;
};

const isDeleteGearDialogOpen = ref(false);
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
</script>

<style lang="scss">
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

.actions {
  display: flex;
  gap: 10px;
}
</style>
