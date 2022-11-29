<template>
  <div>
    <h2 class="categories__title">Categories</h2>
    <v-treeview
      hoverable
      activatable
      :items="categories"
      item-children="subCategories"
    >
      <template #label="{ item }">
        {{ item.name }}
        <v-icon class="ml-2" small @click="openInformationDialog(item)">
          mdi-information
        </v-icon>
      </template>
    </v-treeview>
    <v-btn dark large rounded color="amber" @click="openCreationDialog">
      <v-icon dark> mdi-plus </v-icon>
      Ajouter une categorie
    </v-btn>
    <v-dialog v-model="isCreateDialogOpen" width="600px">
      <CategoryFormVue @close-dialog="closeCreationDialog"></CategoryFormVue>
    </v-dialog>
    <v-dialog v-model="isInformationDialogOpen" width="600px">
      <CategoryDetails
        :category="selectedCategory"
        @close-dialog="closeInformationDialog"
      ></CategoryDetails>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Category } from "~/utils/models/catalog.model";
import CategoryDetails from "./CategoryDetails.vue";
import CategoryFormVue from "./form/CategoryForm.vue";

interface CategoryTreeViewData {
  isCreateDialogOpen: boolean;
  isInformationDialogOpen: boolean;
  selectedCategory?: Category;
}

export default Vue.extend({
  name: "CategoriesTreeView",
  components: { CategoryFormVue, CategoryDetails },
  data(): CategoryTreeViewData {
    return {
      isCreateDialogOpen: false,
      isInformationDialogOpen: false,
      selectedCategory: undefined,
    };
  },
  computed: {
    categories() {
      return this.$accessor.catalog.categoryTree;
    },
  },
  mounted() {
    this.$accessor.catalog.fetchCategoryTree();
  },
  methods: {
    openCreationDialog() {
      this.isCreateDialogOpen = true;
    },
    closeCreationDialog() {
      this.isCreateDialogOpen = false;
    },
    openInformationDialog(category: Category) {
      this.selectedCategory = category;
      this.isInformationDialogOpen = true;
    },
    closeInformationDialog() {
      this.isInformationDialogOpen = false;
    },
    openCategoryUpdateDialog() {},
    openCategoryDeleteDialog() {},
  },
});
</script>

<style lang="scss" scoped></style>
