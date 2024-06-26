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
        <v-icon
          v-if="isCatalogWriter"
          class="ml-2"
          small
          @click="openInformationDialog(item)"
        >
          mdi-information
        </v-icon>
      </template>
    </v-treeview>
    <v-btn
      v-if="isCatalogWriter"
      dark
      large
      rounded
      color="amber"
      @click="openCreationDialog"
    >
      <v-icon dark> mdi-plus </v-icon>
      Ajouter une categorie
    </v-btn>
    <v-dialog v-model="isCreateDialogOpen" width="600px">
      <CategoryForm @close-dialog="closeCreationDialog"></CategoryForm>
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
import CategoryDetails from "../../molecules/logistic/CategoryDetails.vue";
import CategoryForm from "../../molecules/logistic/CategoryForm.vue";
import { WRITE_GEAR_CATALOG } from "@overbookd/permission";
import { CatalogCategory, CatalogCategoryTree } from "@overbookd/http";

type CategoryTreeViewData = {
  isCreateDialogOpen: boolean;
  isInformationDialogOpen: boolean;
  selectedCategory?: CatalogCategory;
};

export default Vue.extend({
  name: "CategoriesTreeView",
  components: { CategoryForm, CategoryDetails },
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
    isCatalogWriter(): boolean {
      return this.$accessor.user.can(WRITE_GEAR_CATALOG);
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
    async openInformationDialog(category: CatalogCategoryTree) {
      this.selectedCategory = await this.$accessor.catalog.fetchCategory(
        category.id,
      );
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
