<template>
  <div class="import">
    <h2>Mise a jour de l'inventaire</h2>

    <v-file-input
      truncate-length="50"
      accept="text/csv"
      label="Import"
      @change="extractInventoryRecords"
    ></v-file-input>

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
              small
              fab
              dark
              color="warning"
              @click="startEditMode(item, index)"
            >
              <v-icon dark> mdi-pencil </v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-card class="listing">
      <v-data-table
        :headers="recordsHeaders"
        :items="inventoryRecords"
        :loading="loading"
      >
        <template #item.gear="{ item }">
          {{ item.gear.name }}
        </template>
      </v-data-table>
    </v-card>

    <v-btn large color="success" rounded @click="saveInventory">
      <v-icon dark> mdi-check </v-icon>Sauvegarder l'inventaire</v-btn
    >

    <v-dialog v-model="isUpdateImportErrorDialogOpen" width="600px">
      <InventoryRecordForm
        :inventory-error="selectedImportError"
        @close-dialog="stopEditMode"
        @add-to-inventory="addToInventory"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { CSVInventoryImportContainer } from "~/domain/inventory/csv-inventory-import-container";
import { GearRepository } from "~/domain/inventory/gear.repository";
import { InventoryRecord } from "~/domain/inventory/inventory-record";
import { InventoryImport } from "~/domain/inventory/inventory-import";
import { Gear } from "~/utils/models/catalog.model";
import { Header } from "~/utils/models/Data";
import {
  DisplayableManualInventoryRecordError,
  ManualInventoryRecordError,
} from "~/domain/inventory/manual-inventory-record";
import InventoryRecordForm from "~/components/organisms/form/InventoryRecordForm.vue";
import { removeItemAtIndex } from "~/utils/functions/list";

interface InventoryData {
  inventoryRecords: InventoryRecord[];
  inventoryImportErrors: ManualInventoryRecordError[];
  recordsHeaders: Header[];
  errorsHeaders: Header[];
  loading: boolean;
  selectedImportError?: DisplayableManualInventoryRecordError;
  selectedImportErrorIndex: number;
  isUpdateImportErrorDialogOpen: boolean;
}

export default Vue.extend({
  name: "InventoryImport",
  components: { InventoryRecordForm },
  data: (): InventoryData => {
    return {
      inventoryRecords: [],
      inventoryImportErrors: [],
      recordsHeaders: [
        { text: "Matos", value: "gear" },
        { text: "Quantite", value: "quantity" },
        { text: "Lieu de stockage", value: "storage" },
      ],
      errorsHeaders: [
        { text: "Matos", value: "gear" },
        { text: "Quantite", value: "quantity" },
        { text: "Lieu de stockage", value: "storage" },
        { text: "Erreur detectee", value: "message" },
        { text: "Action", value: "action" },
      ],
      loading: false,
      selectedImportError: undefined,
      selectedImportErrorIndex: -1,
      isUpdateImportErrorDialogOpen: false,
    };
  },
  computed: {
    gearRepository(): GearRepository {
      return this.$accessor.catalog.gearRepository;
    },
    gears(): Gear[] {
      return this.$accessor.catalog.gears;
    },
    hasError(): boolean {
      return this.inventoryImportErrors.length > 0;
    },
    displayableInventoryImportErrors(): DisplayableManualInventoryRecordError[] {
      return this.inventoryImportErrors.map(
        DisplayableManualInventoryRecordError.fromError
      );
    },
  },
  mounted() {
    if (this.gears.length > 0) return;
    this.$accessor.catalog.fetchGears({});
  },
  methods: {
    async extractInventoryRecords(importFile: File) {
      if (!importFile) {
        this.inventoryRecords = [];
        this.inventoryImportErrors = [];
        return;
      }
      this.loading = true;
      const importContainer = new CSVInventoryImportContainer(
        importFile,
        this.gearRepository
      );
      const { records, errors } = await InventoryImport.toRecords(
        importContainer
      );
      this.inventoryImportErrors = errors;
      this.inventoryRecords = records;
      this.loading = false;
    },
    stopEditMode() {
      this.isUpdateImportErrorDialogOpen = false;
    },
    startEditMode(
      inventoryError: DisplayableManualInventoryRecordError,
      errorIndex: number
    ) {
      this.isUpdateImportErrorDialogOpen = true;
      this.selectedImportErrorIndex = errorIndex;
      this.selectedImportError = inventoryError;
    },
    addToInventory(inventoryRecord: InventoryRecord) {
      this.inventoryRecords = inventoryRecord.mergeInside(
        this.inventoryRecords
      );
      this.inventoryImportErrors = removeItemAtIndex(
        this.inventoryImportErrors,
        this.selectedImportErrorIndex
      );
    },
    async saveInventory() {
      await this.$accessor.inventory.importInventory(this.inventoryRecords);
      this.inventoryImportErrors = [];
      this.inventoryRecords = [];
      this.$emit("import-done");
    },
  },
});
</script>

<style scoped lang="scss">
.btn-group {
  display: flex;
  gap: 5px;
}

.listing {
  margin-bottom: 10px;
}
</style>
