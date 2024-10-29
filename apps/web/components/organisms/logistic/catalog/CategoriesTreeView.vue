<template>
  <v-card class="categories-container">
    <v-card-title>Catégories</v-card-title>
    <v-card-text>
      <v-treeview
        :items="categories"
        item-children="subCategories"
        density="compact"
      >
        <template #title="{ item }">
          {{ item.name }}
          <v-btn
            v-show="isCatalogWriter"
            icon="mdi-pencil"
            size="small"
            variant="flat"
            @click="openCategoryFormDialog(item)"
          />
          <v-btn
            v-show="isCatalogWriter"
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click="openCategoryRemovalConfirmationDialog(item)"
          />
        </template>
      </v-treeview>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-show="isCatalogWriter"
        color="primary"
        size="large"
        text="Ajouter une catégorie"
        prepend-icon="mdi-plus"
        @click="openCategoryFormDialog(undefined)"
      />
    </v-card-actions>
  </v-card>

  <v-dialog v-model="isCategoryFormDialogOpen" width="500px">
    <CategoryFormDialog
      :category="categoryForm"
      @create="createCategory"
      @update="updateCategory"
      @close="closeCategoryFormDialog"
    />
  </v-dialog>

  <v-dialog v-model="isCategoryRemovalConfirmationDialogOpen" width="500px">
    <ConfirmationDialogCard
      confirm-color="error"
      @confirm="removeCategory"
      @close="closeCategoryRemovalConfirmationDialog"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
import type {
  CategoryForm,
  CatalogCategoryTree,
  CatalogCategory,
} from "@overbookd/http";
import { WRITE_GEAR_CATALOG } from "@overbookd/permission";

const catalogStore = useCatalogStore();
const userStore = useUserStore();

catalogStore.fetchCategoryTree();
const categories = computed<CatalogCategoryTree[]>(
  () => catalogStore.categoryTree,
);

const isCatalogWriter = computed<boolean>(() =>
  userStore.can(WRITE_GEAR_CATALOG),
);

const isCategoryFormDialogOpen = ref<boolean>(false);

const selectedCategory = ref<CatalogCategory | undefined>();
const categoryForm = ref<CategoryForm | undefined>();
const openCategoryFormDialog = async (category?: CatalogCategoryTree) => {
  selectedCategory.value = undefined;
  categoryForm.value = undefined;

  if (!category) {
    categoryForm.value = undefined;
    isCategoryFormDialogOpen.value = true;
    return;
  }

  selectedCategory.value = await catalogStore.getCategory(category.id);
  categoryForm.value = {
    name: selectedCategory.value?.name ?? "",
    owner: selectedCategory.value?.owner?.code,
    parent: selectedCategory.value?.parent,
  };
  isCategoryFormDialogOpen.value = true;
};

const createCategory = async (category: CategoryForm) => {
  await catalogStore.createCategory(category);
};
const updateCategory = async (category: CategoryForm) => {
  if (!selectedCategory.value) return;
  await catalogStore.updateCategory(selectedCategory.value?.id, category);
};
const closeCategoryFormDialog = () => {
  isCategoryFormDialogOpen.value = false;
};

const isCategoryRemovalConfirmationDialogOpen = ref<boolean>(false);
const openCategoryRemovalConfirmationDialog = async (
  category: CatalogCategoryTree,
) => {
  selectedCategory.value = await catalogStore.getCategory(category.id);
  isCategoryRemovalConfirmationDialogOpen.value = true;
};
const removeCategory = async () => {
  if (!selectedCategory.value) return;
  await catalogStore.removeCategory(selectedCategory.value);
  closeCategoryRemovalConfirmationDialog();
};
const closeCategoryRemovalConfirmationDialog = () => {
  isCategoryRemovalConfirmationDialogOpen.value = false;
};
</script>

<style scoped>
.categories-container {
  height: fit-content;
}
</style>
