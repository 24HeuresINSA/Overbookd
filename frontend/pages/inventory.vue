<template>
  <div>
    <h1>Inventaire</h1>
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
            :items="inventoryImportErrors"
            :loading="loading"
          >
            <template #item.gear="{ item, index }">
              <span v-if="isInEditMode(index)">
                <SearchGear :dense="true"
              /></span>
              <span v-else>{{ item.record.gear }}</span>
            </template>
            <template #item.quantity="{ item }">
              {{ item.record.quantity }}
            </template>
            <template #item.storage="{ item }">
              {{ item.record.storage }}
            </template>
            <template #item.action="{ index }">
              <span v-if="isInEditMode(index)"> Ajouter </span>
              <span v-else> Edit </span>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <v-data-table
        :headers="recordsHeaders"
        :items="inventoryRecords"
        :loading="loading"
      >
        <template #item.gear="{ item }">
          {{ item.gear.name }}
        </template>
      </v-data-table>
    </div>
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
import { ManualInventoryRecordError } from "~/domain/inventory/manual-inventory-record";
import SearchGear from "~/components/atoms/SearchGear.vue";

interface InventoryData {
  inventoryRecords: InventoryRecord[];
  inventoryImportErrors: ManualInventoryRecordError[];
  recordsHeaders: Header[];
  errorsHeaders: Header[];
  loading: boolean;
  errorLinesInEditMode: number[];
}

export default Vue.extend({
  name: "Inventory",
  components: { SearchGear },
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
      errorLinesInEditMode: [1],
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
    isInEditMode(lineIndex: number): boolean {
      return this.errorLinesInEditMode.includes(lineIndex);
    },
  },
});
</script>
