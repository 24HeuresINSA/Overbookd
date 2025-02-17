<template>
  <v-autocomplete
    v-model="gear"
    :items="gears"
    :item-title="buildGearNameWithCode"
    item-value="id"
    clearable
    :label="label"
    return-object
    :hide-details="hideDetails"
    :disabled="disabled"
    :custom-filter="slugifiedFilter"
    no-data-text="Aucun matos correspondant"
    @keydown.enter="propagateEnter"
  >
    <template #item="{ props, item }">
      <v-list-item v-bind="props" :subtitle="item.raw.category?.path || ''" />
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import type { CatalogGear, GearSearchOptions } from "@overbookd/http";
import { slugifiedFilter } from "~/utils/search/search.utils";

const catalogGearStore = useCatalogGearStore();

const gear = defineModel<CatalogGear>({ required: false });

const { ponctualUsage, owner } = defineProps({
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
const buildGearNameWithCode = (gear: CatalogGear): string => {
  const code = gear.code ? ` (${gear.code})` : "";
  return `${gear.name}${code}`;
};

const gears = computed<CatalogGear[]>(() => catalogGearStore.gears);
const loading = ref<boolean>(gears.value.length === 0);
fetchGears().then(() => (loading.value = false));

const emit = defineEmits(["enter"]);
const propagateEnter = () => emit("enter");
</script>
