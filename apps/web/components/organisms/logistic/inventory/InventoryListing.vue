<template>
  <div class="inventory-listing">
    <h2>Listing</h2>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="inventoryGroupedRecords"
        :loading="loading"
        loading-text="Chargement de l'inventaire..."
        no-data-text="Inventaire vide"
      >
        <template #body="{ items }">
          <tbody>
            <template
              v-for="groupedRecord in items"
              :key="groupedRecord.gear.id"
            >
              <tr>
                <th
                  :rowspan="groupedRecord.records.length + 1"
                  class="text-start"
                >
                  {{ groupedRecord.gear.name }}
                </th>
                <th
                  :rowspan="groupedRecord.records.length + 1"
                  class="text-start"
                >
                  {{ groupedRecord.quantity }}
                </th>
              </tr>
              <tr
                v-for="record in groupedRecord.records"
                :key="`${groupedRecord.gear.id}-${record.storage}`"
              >
                <td class="text-start">{{ record.storage }}</td>
                <td class="text-start">{{ record.quantity }}</td>
              </tr>
            </template>
          </tbody>
        </template>
      </v-data-table>
    </v-card>

    <v-btn
      class="action-button"
      text="Réinitialiser"
      size="large"
      rounded
      @click="askForInit"
    />
  </div>
</template>

<script lang="ts" setup>
import type { InventoryGroupedRecord } from "@overbookd/http";
import type { TableHeaders } from "~/utils/data-table/header";

const inventoryStore = useInventoryStore();

const headers: TableHeaders = [
  { title: "Matos", value: "gear" },
  { title: "Quantité Totale", value: "totalQuantity" },
  { title: "Lieux de stockage", value: "storage" },
  { title: "Quantité", value: "storageQuantity" },
];

const inventoryGroupedRecords = computed<InventoryGroupedRecord[]>(
  () => inventoryStore.groupedRecords,
);

const loading = ref<boolean>(inventoryGroupedRecords.value.length === 0);
inventoryStore.fetchGroupedRecords().then(() => (loading.value = false));

const emit = defineEmits(["ask-init"]);
const askForInit = () => emit("ask-init");
</script>

<style lang="scss" scoped>
.inventory-listing {
  text-align: center;
}

.action-button {
  background-color: deepskyblue;
  margin-top: 15px;
}
</style>
