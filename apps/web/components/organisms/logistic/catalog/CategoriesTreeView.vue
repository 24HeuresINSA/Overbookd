<template>
  <h2>Categories</h2>
  <v-treeview :items="categories" density="compact" item-props>
    <template #title="{ item }">
      {{ item.name }}
      <v-btn
        v-show="isCatalogWriter"
        icon="mdi-pencil"
        size="small"
        variant="flat"
      />
      <v-btn
        v-show="isCatalogWriter"
        icon="mdi-trash-can"
        size="small"
        variant="flat"
      />
    </template>
  </v-treeview>
</template>

<script lang="ts" setup>
import { WRITE_GEAR_CATALOG } from "@overbookd/permission";

const catalogStore = useCatalogStore();
const userStore = useUserStore();

catalogStore.fetchCategoryTree();
const categories = catalogStore.categoryTree;

const isCatalogWriter = computed<boolean>(() =>
  userStore.can(WRITE_GEAR_CATALOG),
);
</script>
