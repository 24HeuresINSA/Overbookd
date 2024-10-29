<template>
  <DesktopPageTitle />
  <div class="catalog-container">
    <CatalogGearListingCard calss="gear-table" />
    <CategoriesTreeView class="category-tree" />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Catalogue Matos" });
</script>

<style scoped>
.catalog-container {
  display: flex;
  gap: 1rem;
}
</style>
