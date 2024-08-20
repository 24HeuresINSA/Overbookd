<template>
  <v-autocomplete
    v-model="signage"
    :items="signages"
    :loading="loading"
    item-value="id"
    item-title="name"
    :clearable="clearable"
    :label="hideLabel ? '' : label"
    :hide-details="hideDetails"
    :readonly="readonly"
    :density="density"
    no-data-text="Aucune signalétique correspondante"
    :custom-filter="slugifiedFilter"
    return-object
    chips
  />
</template>

<script lang="ts" setup>
import type { SignageType, Signage } from "@overbookd/signa";
import { slugifiedFilter } from "~/utils/search/search.utils";
import type { Density } from "~/utils/vuetify/component-props";

const catalogSignageStore = useCatalogSignageStore();

type MinimalSignage = Pick<Signage, "id" | "name" | "type">;
const signage = defineModel<MinimalSignage | null>({ required: true });

const props = defineProps({
  type: {
    type: String as PropType<SignageType | undefined>,
    default: undefined,
  },
  label: {
    type: String,
    default: "Chercher une signalétique",
  },
  hideLabel: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  density: {
    type: String as PropType<Density>,
    default: "comfortable",
  },
});

const allSignages = computed<Signage[]>(() => catalogSignageStore.signages);
const signages = computed<MinimalSignage[]>(() => {
  if (!props.type) return allSignages.value;
  return allSignages.value.filter(({ type }) => type === type);
});

const loading = ref<boolean>(allSignages.value.length === 0);
catalogSignageStore.fetchSignages().then(() => (loading.value = false));
</script>
