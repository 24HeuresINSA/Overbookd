<template>
  <DesktopPageTitle />
  <div class="catalog-container">
    <CatalogGearListingCard class="gear-table" />
    <CategoriesTreeViewCard class="category-tree desktop-only" />
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
  .gear-table {
    width: 75%;
    @media screen and (max-width: $mobile-max-width) {
      width: 100%;
    }
  }
  .category-tree {
    width: 25%;
  }
}
</style>
