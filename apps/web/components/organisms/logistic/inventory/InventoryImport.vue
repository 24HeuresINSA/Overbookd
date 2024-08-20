<template>
  <div class="inventory-update">
    <h2>Mise à jour de l'inventaire</h2>

    <v-file-input
      class="file-import"
      truncate-length="50"
      accept="text/csv"
      label="Import"
      show-size
      @update:model-value="extractInventoryRecords"
    />

    <v-card v-show="hasError" class="warning">
      <v-card-title>
        ⚠️ {{ inventoryImportErrors.length }} erreurs
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="errorsHeaders"
          :items="displayableInventoryImportErrors"
          :loading="loading"
        >
          <template #item.gear="{ item }">
            {{ item.record.gear }}
          </template>
          <template #item.quantity="{ item }">
            {{ item.record.quantity }}
          </template>
          <template #item.storage="{ item }">
            {{ item.record.storage }}
          </template>
          <template #item.message="{ item }">
            {{ item.error }}
          </template>
          <template #item.action="{ item, index }">
            <v-btn
              icon="mdi-pencil"
              small
              fab
              dark
              color="warning"
              @click="startEditMode(item, index)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card>
      <v-data-table
        :headers="recordsHeaders"
        :items="inventoryRecords"
        :loading="loading"
        loading-text="Chargement de l'inventaire..."
        no-data-text="Inventaire vide"
      >
        <template #item.gear="{ item }">
          {{ item.gear.name }}
        </template>
      </v-data-table>
    </v-card>

    <v-btn
      class="action-button"
      text="Sauvegarder l'inventaire"
      prepend-icon="mdi-check"
      color="success"
      size="large"
      rounded
      @click="saveInventory"
    />

    <v-dialog v-model="isUpdateImportErrorDialogOpen" width="600px">
      <InventoryRecordForm
        :inventory-error="
          selectedImportError as DisplayableManualInventoryRecordError
        "
        @close-dialog="stopEditMode"
        @add-to-inventory="addToInventory"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { removeItemAtIndex } from "@overbookd/list";
// import { CSVInventoryImportContainer } from "~/domain/inventory/csv-inventory-import-container";
import { InventoryRecord } from "~/domain/inventory/inventory-record";
// import { InventoryImport } from "~/domain/inventory/inventory-import";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import {
  DisplayableManualInventoryRecordError,
  ManualInventoryRecordError,
} from "~/domain/inventory/manual-inventory-record";
import type { CatalogGear } from "@overbookd/http";
// import type { Gears } from "~/domain/inventory/gears";

const catalogGearStore = useCatalogGearStore();
const inventoryStore = useInventoryStore();

const recordsHeaders: TableHeaders = [
  { title: "Matos", value: "gear" },
  { title: "Quantité", value: "quantity" },
  { title: "Lieu de stockage", value: "storage" },
];
const errorsHeaders: TableHeaders = [
  { title: "Matos", value: "gear" },
  { title: "Quantite", value: "quantity" },
  { title: "Lieu de stockage", value: "storage" },
  { title: "Erreur detectee", value: "message" },
  { title: "Action", value: "action" },
];

const emit = defineEmits(["import-done"]);

const inventoryRecords = ref<InventoryRecord[]>([]);
const inventoryImportErrors = ref<ManualInventoryRecordError[]>([]);
const selectedImportError = ref<
  DisplayableManualInventoryRecordError | undefined
>(undefined);
const selectedImportErrorIndex = ref<number>(-1);
const isUpdateImportErrorDialogOpen = ref<boolean>(false);

// const gearRepository = computed<Gears>(() => catalogGearStore.gearRepository);

const gears = computed<CatalogGear[]>(() => catalogGearStore.gears);

const hasError = computed<boolean>(
  () => inventoryImportErrors.value.length > 0,
);

const displayableInventoryImportErrors = computed<
  DisplayableManualInventoryRecordError[]
>(() =>
  inventoryImportErrors.value.map(
    DisplayableManualInventoryRecordError.fromError,
  ),
);

const loading = ref<boolean>(gears.value.length === 0);
catalogGearStore.fetchGears({}).then(() => (loading.value = false));

const extractInventoryRecords = async (importFile: File | File[] | null) => {
  const file = Array.isArray(importFile)
    ? importFile.length > 0
      ? importFile[0]
      : null
    : importFile;
  if (!file) {
    inventoryRecords.value = [];
    inventoryImportErrors.value = [];
    return;
  }
  loading.value = true;
  // FIXME
  // const importContainer = new CSVInventoryImportContainer(
  //   importFile,
  //   gearRepository.value,
  // );
  // const { records, errors } = await InventoryImport.toRecords(importContainer);
  // inventoryImportErrors.value = errors;
  // inventoryRecords.value = records;
  loading.value = false;
};

const stopEditMode = () => (isUpdateImportErrorDialogOpen.value = false);

const startEditMode = (
  inventoryError: DisplayableManualInventoryRecordError,
  errorIndex: number,
) => {
  isUpdateImportErrorDialogOpen.value = true;
  selectedImportErrorIndex.value = errorIndex;
  selectedImportError.value = inventoryError;
};

const addToInventory = (inventoryRecord: InventoryRecord) => {
  inventoryRecords.value = inventoryRecord.mergeInside(
    inventoryRecords.value as InventoryRecord[],
  );
  inventoryImportErrors.value = removeItemAtIndex(
    inventoryImportErrors.value,
    selectedImportErrorIndex.value,
  );
};

const saveInventory = async () => {
  await inventoryStore.importInventory(
    inventoryRecords.value as InventoryRecord[],
  );
  inventoryImportErrors.value = [];
  inventoryRecords.value = [];
  emit("import-done");
};
</script>

<style lang="scss" scoped>
.inventory-update {
  text-align: center;
}

.file-import {
  margin: 15px auto 0 auto;

  @media only screen and (min-width: $mobile-max-width) {
    width: 75%;
  }
}

.action-button {
  margin-top: 15px;
}
</style>
