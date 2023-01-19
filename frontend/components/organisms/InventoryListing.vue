<template>
  <v-card>
    <v-card-title> Listing </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="inventoryGroupedRecords"
        show-expand
        :expanded.sync="details"
        item-key="gear.id"
        @item-expanded="fetchDetails"
      >
        <template #item.gear="{ item }">
          {{ item.gear.name }}
        </template>
        <template #item.quantity="{ item }">
          {{ item.quantity }}
        </template>
        <template #expanded-item="{ item }">
          <td :colspan="headers.length">
            <ul class="details">
              <li v-for="record in item.records" :key="record.storage">
                <strong>{{ record.quantity }}</strong> se trouvent dans
                {{ record.storage }}
              </li>
            </ul>
          </td>
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
import { InventoryGroupedRecord } from "~/store/inventory";
import { Header } from "~/utils/models/Data";

interface InventoryListingData {
  headers: Header[];
  details: InventoryGroupedRecord[];
}
export default Vue.extend({
  name: "InventoryListing",
  data: (): InventoryListingData => ({
    headers: [
      { text: "Matos", value: "gear" },
      { text: "Quantite", value: "quantity" },
      { text: "", value: "data-table-expand" },
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

<style lang="scss" scoped>
.details {
  margin-top: 0.8rem;
  margin-bottom: 0.5rem;
}
</style>
