<template>
  <DialogCard @close="close">
    <template #title>Ajouter une nouvelle Fiche Emprunt</template>
    <template #content>
      <v-text-field
        v-model="lender"
        label="Prêteur"
        @keydown.enter="initBorrow"
      />
      <DateTimeField
        v-model="availableOn"
        label="Date de disponibilité"
        @enter="initBorrow"
      />
      <DateTimeField
        v-model="unavailableOn"
        label="Date de retour"
        @enter="initBorrow"
      />
    </template>
    <template #actions>
      <v-btn
        text="Créer la Fiche Emprunt"
        color="primary"
        size="large"
        :disabled="cantInitBorrow"
        @click="initBorrow"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Borrow, InitBorrowForm } from "@overbookd/logistic";
import { Period } from "@overbookd/time";
import { BORROW_GEARS_URL } from "@overbookd/web-page";

const borrowStore = useBorrowStore();

const lender = ref<string>("");
const availableOn = ref<Date>(new Date());
const unavailableOn = ref<Date>(new Date());

const selectBorrow = computed<Borrow>(() => borrowStore.selected);
const cantInitBorrow = computed<boolean>(() => {
  const hasLender = lender.value.trim();
  if (!hasLender) return true;

  try {
    Period.init({ start: availableOn.value, end: unavailableOn.value });
  } catch (_error) {
    return true;
  }
  return false;
});

const emit = defineEmits(["close"]);
const loading = ref<boolean>(false);

const close = () => {
  emit("close");
  loading.value = false;
};

const initBorrow = async () => {
  if (!lender.value || !availableOn.value || !unavailableOn.value) return;
  loading.value = true;

  const borrow: InitBorrowForm = {
    lender: lender.value,
    availableOn: availableOn.value,
    unavailableOn: unavailableOn.value,
  };
  await borrowStore.init(borrow);

  if (!selectBorrow.value.id) return;
  await navigateTo(`${BORROW_GEARS_URL}/${selectBorrow.value.id}`);
};
</script>
