<template>
  <DesktopPageTitle />
  <div class="catalog-container">
    <CatalogGearListingCard calss="gear-table" />
    <CategoriesTreeView class="category-tree desktop-only" />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Catalogue Matos" });
</script>

<style lang="scss" scoped>
.catalog-container {
  display: flex;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}
</style>
