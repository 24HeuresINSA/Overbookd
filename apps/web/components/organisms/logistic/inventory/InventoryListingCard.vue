<template>
  <v-card>
    <v-card-title>Liste du matos</v-card-title>
    <v-card-text class="card-content">
      <v-data-table
        :headers="headers"
        :items="inventoryGroupedRecords"
        :loading="loading"
        loading-text="Chargement de l'inventaire..."
        no-data-text="Inventaire vide"
        density="comfortable"
        :mobile="isMobile"
      >
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
          </div>
        </template>
      </v-data-table>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        text="Réinitialiser"
        class="reset-button"
        rounded
        @click="askForInit"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { InventoryGroupedRecord } from "@overbookd/http";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const inventoryStore = useInventoryStore();
const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Nom du matos", value: "name" },
  { title: "Quantité Totale", value: "quantity", sortable: true },
  { title: "Lieu de stockage", value: "storage", sortable: true },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const inventoryGroupedRecords = computed<InventoryGroupedRecord[]>(
  () => inventoryStore.groupedRecords,
);

const loading = ref<boolean>(inventoryGroupedRecords.value.length === 0);
inventoryStore.fetchGroupedRecords().then(() => (loading.value = false));

const emit = defineEmits(["ask-init"]);
const askForInit = () => emit("ask-init");
</script>

<style scoped>
.card-content {
  padding-bottom: 0;
}
</style>
