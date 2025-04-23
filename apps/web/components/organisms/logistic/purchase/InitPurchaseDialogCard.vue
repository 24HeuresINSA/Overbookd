<template>
  <DialogCard @close="close">
    <template #title> Ajouter une nouvelle Fiche Achat</template>
    <template #content>
      <v-text-field
        v-model="seller"
        label="Vendeur"
        @keydown.enter="initPurchase"
      />
      <DateTimeField
        v-model="availableOn"
        label="Date de disponibilité"
        @enter="initPurchase"
      />
    </template>
    <template #actions>
      <v-btn
        text="Créer la Fiche Achat"
        color="primary"
        size="large"
        :disabled="cantInitPurchase"
        @click="initPurchase"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { InitPurchaseForm, Purchase } from "@overbookd/logistic";
import { PURCHASE_GEARS_URL } from "@overbookd/web-page";
import { openPageWithId } from "~/utils/navigation/router.utils";

const purchaseStore = usePurchaseStore();

const seller = ref<string>("");
const availableOn = ref<Date>(new Date());

const selectedPurchase = computed<Purchase>(() => purchaseStore.selected);
const cantInitPurchase = computed<boolean>(() => !seller.value.trim());

const emit = defineEmits(["close"]);
const loading = ref<boolean>(false);

const close = () => {
  emit("close");
  loading.value = false;
};

const initPurchase = async (event: PointerEvent) => {
  if (!seller.value || !availableOn.value) return;
  loading.value = true;

  const purchase: InitPurchaseForm = {
    seller: seller.value,
    availableOn: availableOn.value,
  };
  await purchaseStore.init(purchase);

  if (!selectedPurchase.value.id) return;
  await openPageWithId(event, PURCHASE_GEARS_URL, selectedPurchase.value.id);
  close();
};
</script>
