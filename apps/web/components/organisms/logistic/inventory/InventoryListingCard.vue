<template>
  <v-card>
    <v-card-text class="card-content">
      <GearFilter
        v-model:search="filters.search"
        v-model:category="filters.category"
        v-model:team="filters.team"
        @update:options="updateGearSearchOptions"
      >
        <template #additional-filters>
          <v-autocomplete
            v-model="storage"
            :items="storages"
            label="Lieu de stockage"
            hide-details
            clearable
            hide-selected
            :custom-filter="slugifiedFilter"
            no-data-text="Aucun lieu correspondant"
          />
        </template>
      </GearFilter>
      <v-data-table
        :headers="headers"
        :items="inventoryGroupedRecords"
        :loading="loading"
        loading-text="Chargement de l'inventaire..."
        no-data-text="Inventaire vide"
        density="comfortable"
        :mobile="isMobile"
      >
        <template #item.code="{ item }">
          {{ item.gear.code }}
        </template>

        <template #item.name="{ item }">
          {{ item.gear.name }}
        </template>

        <template #item.storage="{ item }">
          <div
            v-for="record in item.records"
            :key="`${item.gear.id}-${record.storage}`"
          >
            <span>{{ record.storage }}</span>
            <strong v-if="item.records.length > 1">
              ({{ record.quantity }})
            </strong>
            <span v-if="record.comment"> • {{ record.comment }}</span>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <div class="action-buttons">
    <v-btn
      text="Réinitialiser"
      prepend-icon="mdi-refresh"
      color="primary"
      size="large"
      @click="askForInit"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  type GearSearchOptions,
  type InventoryGroupedRecord,
  type InventoryRecordSearchOptions,
} from "@overbookd/http";
import type { FilterGear } from "~/utils/logistic/filter-gear";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { slugifiedFilter } from "~/utils/search/search.utils";

const inventoryStore = useInventoryStore();
const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Référence", value: "code", width: "20%" },
  { title: "Nom du matos", value: "name", width: "30%" },
  { title: "Quantité", value: "quantity", sortable: true, width: "15%" },
  { title: "Lieu de stockage", value: "storage", sortable: true },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const inventoryGroupedRecords = computed<InventoryGroupedRecord[]>(
  () => inventoryStore.groupedRecords,
);
const storages = computed<string[]>(() => inventoryStore.storages);

const filters = reactive<FilterGear>({
  search: "",
  category: undefined,
  team: undefined,
});
const gearSearchOptions = ref<GearSearchOptions>({});

const storage = ref<string | undefined>(undefined);

const searchOptions = computed<InventoryRecordSearchOptions>(() => {
  const potentialStorage = storage.value ? { storage: storage.value } : {};
  return { ...gearSearchOptions.value, ...potentialStorage };
});

const loading = ref<boolean>(inventoryGroupedRecords.value.length === 0);

watch(
  () => searchOptions.value,
  () => {
    loading.value = true;
    inventoryStore
      .fetchGroupedRecords(searchOptions.value)
      .then(() => (loading.value = false));
  },
  { immediate: true },
);

inventoryStore.fetchStorages();

const updateGearSearchOptions = (searchOptions: GearSearchOptions) =>
  (gearSearchOptions.value = searchOptions);

const emit = defineEmits(["ask-init"]);
const askForInit = () => emit("ask-init");
</script>

<style scoped>
.card-content {
  padding-bottom: 0;
}

.action-buttons {
  margin-top: 15px;
  display: flex;
  gap: 25px;
  justify-content: center;
}
</style>
