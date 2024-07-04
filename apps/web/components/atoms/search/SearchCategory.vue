<template>
  <v-autocomplete
    v-model="category"
    :items="categories"
    :loading="loading"
    loading-text="Chargement des categories..."
    item-title="name"
    :label="label"
    :hide-details="hideDetails"
    chips
    clearable
    return-object
    no-data-text="Aucune categorie correspondante"
    @update:search-input="searchCategory"
  >
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :title="item.raw.name"
        :subtitle="item.raw.path"
      />
    </template>
  </v-autocomplete>
</template>

<script lang="ts" setup>
import type { CatalogCategory } from "@overbookd/http";

const catalogStore = useCatalogStore();

const category = defineModel<CatalogCategory | undefined>({
  required: true,
});

const { label } = defineProps({
  label: {
    type: String,
    default: "Chercher une categorie",
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

const categories = computed<CatalogCategory[]>(() => catalogStore.categories);

const loading = ref(categories.value.length === 0);
catalogStore.fetchCategories().then(() => (loading.value = false));

const searchCategory = (categoryName: string | null) => {
  if (categoryName && categoryName.length < 3) return;
  const searchOptions = categoryName ? { name: categoryName } : {};
  catalogStore.fetchCategories(searchOptions);
};
</script>
