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
            @click="openEditCategoryFormDialog(item)"
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
        @click="openNewCategoryFormDialog"
      />
    </v-card-actions>
  </v-card>

  <v-dialog v-model="isCategoryFormDialogOpen" width="500px">
    <CategoryFormDialog
      :category="selectedCategory"
      @add="addCategory"
      @update="updateCategory"
      @close="closeCategoryFormDialog"
    />
  </v-dialog>

  <v-dialog v-model="isCategoryRemovalConfirmationDialogOpen" width="500px">
    <ConfirmationDialogCard
      confirm-color="error"
      @confirm="removeCategory"
      @close="closeCategoryRemovalConfirmationDialog"
    >
      <template #title> Supprimer une catégorie </template>
      <template #statement>
        Tu es sur le point de supprimer la catégorie
        <strong>{{ selectedCategory?.name }}</strong>
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { CategoryForm, CatalogCategoryTree } from "@overbookd/http";
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

const selectedCategory = ref<CatalogCategoryTree | undefined>();

const isCategoryFormDialogOpen = ref<boolean>(false);
const openNewCategoryFormDialog = () => {
  selectedCategory.value = undefined;
  isCategoryFormDialogOpen.value = true;
};
const openEditCategoryFormDialog = (category: CatalogCategoryTree) => {
  selectedCategory.value = category;
  isCategoryFormDialogOpen.value = true;
};
const addCategory = async (category: CategoryForm) => {
  await catalogStore.addCategory(category);
};
const updateCategory = async (update: {
  id: number;
  category: CategoryForm;
}) => {
  const { id, category } = update;
  await catalogStore.updateCategory(id, category);
};
const closeCategoryFormDialog = () => {
  isCategoryFormDialogOpen.value = false;
};

const isCategoryRemovalConfirmationDialogOpen = ref<boolean>(false);
const openCategoryRemovalConfirmationDialog = (
  category: CatalogCategoryTree,
) => {
  selectedCategory.value = category;
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
