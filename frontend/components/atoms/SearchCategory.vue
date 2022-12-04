<template>
  <v-autocomplete
    :value="category"
    :items="categories"
    :loading="loading"
    item-text="name"
    chips
    clearable
    item-value="id"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    return-object
    @update:search-input="searchCategory"
    @change="propagateEvent"
  >
    <template #item="listedCategory">
      <v-list-item-content>
        <v-list-item-title
          v-text="listedCategory.item.name"
        ></v-list-item-title>
        <v-list-item-subtitle
          v-text="listedCategory.item.path"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template #no-data>
      <v-list-item> Aucune categorie correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { CategorySearchOptions } from "~/store/catalog";
import { Category } from "~/utils/models/catalog.model";

interface SearchCategoryData {
  category?: Category;
  loading: boolean;
}

export default Vue.extend({
  name: "SearchCategory",
  model: {
    prop: "category",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher une categorie",
    },
    category: {
      type: Object,
      default: undefined,
    },
    boxed: {
      type: Boolean,
      default: true,
    }
  },
  data(): SearchCategoryData {
    return {
      loading: false,
    };
  },
  computed: {
    categories() {
      return this.$accessor.catalog.categories;
    },
  },
  mounted() {
    if (this.categories.length) return;
    this.$accessor.catalog.fetchCategories({});
  },
  methods: {
    searchCategory(categoryName: string | null) {
      if (categoryName && categoryName.length < 3) return;
      let searchOptions = {};
      if (categoryName) {
        searchOptions = { ...searchOptions, name: categoryName };
      }
      this.fetchCategories(searchOptions);
    },
    async fetchCategories(searchOptions: CategorySearchOptions) {
      this.loading = true;
      await this.$accessor.catalog.fetchCategories(searchOptions);
      this.loading = false;
    },
    propagateEvent(category: Category) {
      this.$emit("change", category);
    },
  },
});
</script>
