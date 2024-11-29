<template>
  <DialogCard @close="close">
    <template #title> Matos </template>
    <template #content>
      <v-text-field
        v-model="name"
        append-icon="mdi-hammer-screwdriver"
        label="Nom du matos"
        clear-icon="mdi-close-circle-outline"
        clearable
        outlined
        counter
        hide-details
        :rules="[rules.nameMinLength]"
      />
      <v-switch
        v-model="isPonctualUsage"
        :false-value="false"
        color="primary"
        label="Est du matos d'appoint"
        hide-details
      />
      <v-switch
        v-model="isConsumable"
        :false-value="false"
        color="primary"
        label="Est du matos consommable"
        hide-details
      />
      <SearchCategory
        v-model="category"
        label="Choisis une categorie associée"
        hide-details
      />
    </template>
    <template #actions>
      <v-btn
        prepend-icon="mdi-checkbox-marked-circle-outline"
        text="Sauvegarder"
        size="large"
        :disabled="cantCreateOrUpdateGear"
        @click="createOrUpdateGear"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { minLength } from "~/utils/rules/input.rules";
import type {
  CatalogCategory,
  CatalogGear,
  CatalogGearForm,
} from "@overbookd/http";

const catalogGearStore = useCatalogGearStore();

const NAME_MIN_LENGTH = 3;
const rules = { nameMinLength: minLength(NAME_MIN_LENGTH) };

const props = defineProps({
  gear: {
    type: Object as PropType<CatalogGear>,
    default: () => ({
      name: "",
      category: undefined,
      isPonctualUsage: false,
      isConsumable: false,
    }),
  },
});

const name = ref<string>(props.gear.name);
const category = ref<CatalogCategory | undefined>(props.gear.category);
const isPonctualUsage = ref<boolean>(props.gear.isPonctualUsage);
const isConsumable = ref<boolean>(props.gear.isConsumable);

watch(
  () => props.gear,
  (gear: CatalogGear) => {
    name.value = gear.name;
    category.value = gear.category;
    isPonctualUsage.value = gear.isPonctualUsage;
  },
);

const shouldUpdateCategory = computed<boolean>(
  () => category.value !== undefined || props.gear.category !== undefined,
);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const cantCreateOrUpdateGear = computed<boolean>(
  () => name.value.length < NAME_MIN_LENGTH || !category.value,
);
const createOrUpdateGear = async () => {
  if (cantCreateOrUpdateGear.value) return;
  const categoryParams = shouldUpdateCategory.value
    ? { category: category.value?.id }
    : {};
  const gear: CatalogGearForm = {
    name: name.value,
    isPonctualUsage: isPonctualUsage.value,
    isConsumable: isConsumable.value,
    ...categoryParams,
  };
  props.gear.id
    ? await catalogGearStore.updateGear(props.gear.id, gear)
    : await catalogGearStore.createGear(gear);

  close();
  name.value = "";
  category.value = undefined;
  isPonctualUsage.value = false;
  isConsumable.value = false;
};
</script>
