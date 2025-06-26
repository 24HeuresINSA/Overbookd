<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredPurchases"
        :loading="loading"
        loading-text="Chargement des fiches achat..."
        no-data-text="Aucune fiche achat"
        :hover="filteredPurchases.length > 0"
        :mobile="isMobile"
        @click:row="openPurchase"
        @auxclick:row="openPurchaseInNewTab"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Chercher un achat"
            hide-details
            clearable
            @click:clear="search = ''"
          />
        </template>

        <template #item.availableOn="{ item }">
          {{ formatDateToHumanReadable(item.availableOn) }}
        </template>

        <template #item.remove="{ item }">
          <v-btn
            icon="mdi-trash-can"
            aria-label="Supprimer la fiche achat"
            title="Supprimer la fiche achat"
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
import { SlugifyService } from "@overbookd/slugify";
import {
  type Searchable,
  keepMatchingSearchCriteria,
} from "~/utils/search/search.utils";

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

const search = ref<string>("");

const searchablePurchases = computed<Searchable<Purchase>[]>(() => {
  return purchases.value.map((purchase) => ({
    ...purchase,
    searchable: SlugifyService.apply(`${purchase.id} ${purchase.seller}`),
  }));
});
const filteredPurchases = computed<Purchase[]>(() => {
  if (!search.value) return searchablePurchases.value;
  return searchablePurchases.value.filter((purchase) =>
    keepMatchingSearchCriteria(search.value)(purchase),
  );
});

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
