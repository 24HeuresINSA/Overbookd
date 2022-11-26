<template>
  <v-autocomplete
    v-model="category"
    :items="categories"
    :loading="loading"
    chips
    clearable
    filled
    item-text="name"
    item-value="id"
    label="Chercher une categorie"
    solo
    return-object
    @input="searchCategory"
    @update:search-input="searchCategory"
  >
    <template #no-data>
      <v-list-item> Categorie non trouvee, voulez-vous la creer ? </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { CategorySearchOptions } from "~/store/catalog";
import { Category } from "~/utils/models/catalog.model";

interface SearchCategoryData {
  category?: Category;
  categories: Category[];
  loading: boolean;
}

export default Vue.extend({
  name: "SearchCategory",
  data(): SearchCategoryData {
    return {
      category: undefined,
      categories: [],
      loading: false,
    };
  },
  methods: {
    searchCategory(e: any) {
      console.log(e);
      if (!e || e.length < 3) return;
      const searchOptions = { name: e };
      this.fetchCategories(searchOptions);
    },
    async fetchCategories(searchOptions: CategorySearchOptions) {
      this.loading = true;
      await this.$accessor.catalog.fetchCategories(searchOptions);
      this.loading = false;
    },
  },
});
</script>
