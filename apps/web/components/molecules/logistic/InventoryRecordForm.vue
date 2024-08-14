<template>
  <DialogCard @close="close">
    <template #title> Entrée de l'inventaire </template>
    <template #content>
      <form class="inventory-form">
        <div class="inventory-form__fields">
          <SearchGear v-model="gear" :label="gearHelpMessage" :dense="true" />
          <span class="fields--imutable">
            Quantite: {{ inventoryError?.record.quantity }}
          </span>
          <span class="fields--imutable">
            Lieu de stockage: {{ inventoryError?.record.storage }}
          </span>
        </div>
      </form>
    </template>
    <template #actions>
      <v-btn
        text="Ajouter l'entrée à l'inventaire"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        size="large"
        :disabled="isNotValidForm"
        @click="addToInventory"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { DisplayableManualInventoryRecordError } from "~/domain/inventory/manual-inventory-record";
import type { CatalogGear } from "@overbookd/http";

const props = defineProps({
  inventoryError: {
    type: DisplayableManualInventoryRecordError,
    default: () => ({
      record: {
        gear: "",
        quantity: 0,
        storage: "",
      },
      toInventoryRecord: () => new Error(),
    }),
  },
});

const gear = ref<CatalogGear | undefined>(undefined);

const isNotValidForm = computed<boolean>(() => !gear.value);
const gearHelpMessage = computed<string>(
  () => `${props.inventoryError.record.gear} a été cherché précédemment`,
);

const emit = defineEmits(["close", "add-to-inventory"]);
const close = () => emit("close");

const addToInventory = () => {
  if (!gear.value) return;
  const inventoryRecord = props.inventoryError.toInventoryRecord(gear.value);
  emit("add-to-inventory", inventoryRecord);
  close();
};

watch(
  () => props.inventoryError,
  () => (gear.value = undefined),
);
</script>

<style lang="scss" scoped>
.inventory-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  &__fields {
    width: 80%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    &--immutable {
      font-size: 1.7rem;
      color: black;
    }
  }
}
</style>
