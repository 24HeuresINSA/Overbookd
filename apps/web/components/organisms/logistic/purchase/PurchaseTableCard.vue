<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="purchases"
        :items-per-page="20"
        :loading="loading"
        loading-text="Chargement des fiches achat..."
        no-data-text="Aucune fiche achat"
        :hover="purchases.length > 0"
        :mobile="isMobile"
        @click:row="openPurchase"
        @auxclick:row="openPurchaseInNewTab"
      >
        <template #item.availableOn="{ item }">
          {{ formatDateToHumanReadable(item.availableOn) }}
        </template>

        <template #item.remove="{ item }">
          <v-btn
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click.stop="removePurchase(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { formatDateToHumanReadable } from "@overbookd/time";
import type { Purchase } from "@overbookd/logistic";
import { PURCHASE_GEARS_URL } from "@overbookd/web-page";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import {
  openPageWithId,
  openPageWithIdInNewTab,
} from "~/utils/navigation/router.utils";

const purchaseStore = usePurchaseStore();
const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Nom", value: "seller", sortable: true },
  { title: "Date de disponibilité", value: "availableOn", sortable: true },
  { title: "Supprimer", value: "remove", align: "center" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const purchases = computed<Purchase[]>(() => purchaseStore.all);
const loading = ref<boolean>(purchases.value.length === 0);
purchaseStore.fetchAll().then(() => (loading.value = false));

const removePurchase = async (purchase: Purchase) => {
  await purchaseStore.remove(purchase.id);
};

const openPurchaseInNewTab = (_: PointerEvent, target: { item: Purchase }) => {
  const { id } = { ...target.item };
  openPageWithIdInNewTab(PURCHASE_GEARS_URL, id);
};
const openPurchase = (event: PointerEvent, target: { item: Purchase }) => {
  const { id } = { ...target.item };
  openPageWithId(event, PURCHASE_GEARS_URL, id);
};
</script>
