<template>
  <v-card>
    <v-card-title> Listing </v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="inventoryGroupedRecords">
        <template #body="{ items }">
          <tbody>
            <template v-for="groupedRecord in items">
              <tr :key="groupedRecord.gear.id">
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
    </v-card-text>
    <v-card-actions>
      <v-btn color="green" class="white--text px-4" @click="askForInit">
        Reinitialiser
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { InventoryGroupedRecord } from "@overbookd/http";
import { Header } from "~/utils/data-table/header";

type InventoryListingData = {
  headers: Header[];
  details: InventoryGroupedRecord[];
};
export default Vue.extend({
  name: "InventoryListing",
  data: (): InventoryListingData => ({
    headers: [
      { text: "Matos", value: "gear" },
      { text: "Quantite Totale", value: "totalQuantity" },
      { text: "Lieux de stockage", value: "storage" },
      { text: "Quantite", value: "storageQuantity" },
    ],
    details: [],
  }),
  computed: {
    inventoryGroupedRecords(): InventoryGroupedRecord[] {
      return this.$accessor.inventory.groupedRecords;
    },
  },
  mounted() {
    if (!this.inventoryGroupedRecords.length)
      this.$accessor.inventory.fetchGroupedRecords();
  },
  methods: {
    askForInit() {
      this.$emit("ask-init");
    },
    fetchDetails(expandedItem: {
      item: InventoryGroupedRecord;
      value: boolean;
    }) {
      if (!expandedItem.value) return;

      if (expandedItem.item.records.length > 0) return;

      this.$accessor.inventory.fetchRecords(expandedItem.item.gear.id);
    },
  },
});
</script>
