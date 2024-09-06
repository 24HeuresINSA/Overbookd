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
        <div class="gear-request-form">
          <InquiryFormFields
            v-model:gear="gear"
            v-model:quantity="quantity"
            class="gear-request-form__fields"
          />
          <v-btn
            icon="mdi-plus"
            color="primary"
            class="gear-request-form__btn"
            :disabled="cantAddGearRequest"
            rounded="pill"
            @click="addGearRequest"
          />
        </div>

        <v-data-table
          :headers="headers"
          :items="selectedPurchase.gears"
          :items-per-page="-1"
          no-data-text="Aucun achat de matos"
          disable-pagination
          hide-default-footer
        >
          <template #item.remove="{ item }">
            <v-btn
              icon="mdi-trash-can"
              size="small"
              variant="flat"
              @click="removeGearRequest(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { CatalogGear } from "@overbookd/http";
import type { GearRequest, Purchase } from "@overbookd/logistic";
import { PURCHASE_GEARS_URL } from "@overbookd/web-page";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const route = useRoute();
const purchaseStore = usePurchaseStore();

const headers: TableHeaders = [
  { title: "Quantité", value: "quantity", sortable: true },
  { title: "Nom", value: "name", sortable: true },
  {
    title: "Supprimer",
    value: "remove",
    align: "center",
  },
];

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
  if (selectedPurchase.value.id !== purchaseIdFromUrl.value) {
    navigateTo(PURCHASE_GEARS_URL);
  }
});

useHead({ title: headTitle.value });
watch(seller, () => (document.title = headTitle.value));

const updateSeller = (seller: string) => {
  purchaseStore.plan({ seller });
};
const updateAvailableOn = (availableOn: Date) => {
  purchaseStore.plan({ availableOn });
};

const gear = ref<CatalogGear | undefined>();
const quantity = ref<number>(1);

const cantAddGearRequest = computed<boolean>(
  () => !gear.value || quantity.value <= 0,
);
const addGearRequest = () => {
  if (!gear.value) return;
  const gearRequest = { slug: gear.value.slug, quantity: quantity.value };
  purchaseStore.addGearRequest(gearRequest);
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

.gear-request-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 10px;
  margin-bottom: 0;
  &__fields {
    width: 100%;
  }
  &__btn {
    margin: 10px 0 30px 20px;
  }
  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__btn {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
