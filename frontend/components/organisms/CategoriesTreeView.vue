<template>
  <div>
    <h2>Categories</h2>
    <SearchCategoryVue></SearchCategoryVue>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchCategoryVue from "../atoms/SearchCategory.vue";

export default Vue.extend({
  name: "CategoriesTreeView",
  components: { SearchCategoryVue },
});
</script>
