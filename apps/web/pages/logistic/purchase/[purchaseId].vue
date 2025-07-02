<template>
  <DesktopPageTitle :title="pageTitle" />
  <div class="purchase">
    <v-card>
      <v-card-title>Informations sur l'achat</v-card-title>
      <v-card-text class="purchase-info">
        <v-text-field
          :model-value="selectedPurchase.seller"
          label="Vendeur"
          hide-details
          @update:model-value="updateSeller"
        />
        <DateTimeField
          :model-value="selectedPurchase.availableOn"
          label="Date de disponibilité"
          hide-details
          @update:model-value="updateAvailableOn"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Matos à acheter</v-card-title>
      <v-card-text>
        <BasicGearRequestFormTable
          :gears="selectedPurchase.gears"
          no-data-text="Aucun matos à acheter"
          @add="addGearRequest"
          @remove="removeGearRequest"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { GearRequest, Purchase } from "@overbookd/logistic";
import { PURCHASE_GEARS_URL } from "@overbookd/web-page";

const route = useRoute();
const purchaseStore = usePurchaseStore();

const selectedPurchase = computed<Purchase>(() => purchaseStore.selected);
const seller = computed<string>(() => selectedPurchase.value.seller);
const purchaseIdFromUrl = computed<number>(() => +route.params.purchaseId);

const pageTitle = computed<string>(
  () => `Fiche Achat n°${purchaseIdFromUrl.value}`,
);
const headTitle = computed<string>(() => {
  const displayedName = seller.value ? ` - ${seller.value}` : "";
  return `Achat ${purchaseIdFromUrl.value}${displayedName}`;
});

onMounted(async () => {
  await purchaseStore.fetchOne(purchaseIdFromUrl.value);
  if (selectedPurchase.value.id !== purchaseIdFromUrl.value)
    await navigateTo(PURCHASE_GEARS_URL);
});

useHead({ title: headTitle.value });
watch(seller, () => (document.title = headTitle.value));

const updateSeller = (seller: string) => {
  purchaseStore.plan({ seller });
};
const updateAvailableOn = (availableOn: Date) => {
  purchaseStore.plan({ availableOn });
};

const addGearRequest = (gear: GearRequest) => {
  purchaseStore.addGearRequest(gear);
};
const removeGearRequest = (gear: GearRequest) => {
  purchaseStore.removeGearRequest(gear.slug);
};
</script>

<style lang="scss" scoped>
.purchase {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.purchase-info {
  display: flex;
  gap: 1em;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 0.2em;
  }
}
</style>
