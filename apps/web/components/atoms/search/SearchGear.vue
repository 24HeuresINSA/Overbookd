<template>
  <v-autocomplete
    v-model="gear"
    :items="gears"
    item-title="name"
    item-value="id"
    clearable
    :label="label"
    return-object
    :hide-details="hideDetails"
    :disabled="disabled"
    no-data-text="Aucun matos correspondant"
  >
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="item.raw.name"
        :subtitle="item.raw.category?.path || ''"
      />
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import type { CatalogGear, GearSearchOptions } from "@overbookd/http";

const catalogGearStore = useCatalogGearStore();

const gear = defineModel<CatalogGear>({ required: false });

const { label, hideDetails, disabled, ponctualUsage, owner } = defineProps({
  label: {
    type: String,
    default: "Chercher du matos",
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  ponctualUsage: {
    type: Boolean,
    default: undefined,
  },
  owner: {
    type: String,
    default: undefined,
  },
});

const buildSearchOptions = (): GearSearchOptions => {
  const ownerOption = owner ? { owner } : {};
  const ponctualUsageOption =
    ponctualUsage !== undefined ? { ponctualUsage } : {};
  return { ...ownerOption, ...ponctualUsageOption };
};
const fetchGears = async () => {
  const searchOptions = buildSearchOptions();
  await catalogGearStore.fetchGears(searchOptions);
};

const gears = computed<CatalogGear[]>(() => catalogGearStore.gears);
const loading = ref(gears.value.length === 0);
fetchGears().then(() => (loading.value = false));
</script>
