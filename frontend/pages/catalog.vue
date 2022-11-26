<template>
  <div>
    <h1>Catalogue</h1>
    <div class="catalog">
      <GearListing class="gears"></GearListing>
      <CategoriesTreeView class="categories"></CategoriesTreeView>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CategoriesTreeView from "~/components/organisms/CategoriesTreeView.vue";
import GearListing from "~/components/organisms/GearListing.vue";

export default Vue.extend({
  name: "Catalog",
  components: { GearListing, CategoriesTreeView },
});
</script>

<style lang="scss">
form {
  margin-bottom: 1.2rem;
}
.filter {
  display: flex;
  gap: 5%;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
}
.creation {
  display: flex;
  gap: 5%;
}
.catalog {
  display: flex;
  gap: 5%;
  justify-content: space-between;
  .gears {
    flex-grow: 5;
  }
  .categories {
    flex-grow: 4;
  }
}
</style>
