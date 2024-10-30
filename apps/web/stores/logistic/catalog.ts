import type {
  CatalogCategory,
  CatalogCategoryTree,
  CategoryForm,
  CategorySearchOptions,
} from "@overbookd/http";
import { CategoryRepository } from "~/repositories/logistic/catalog.repository";
import { isHttpError } from "~/utils/http/http-error.utils";

type State = {
  categories: CatalogCategory[];
  categoryTree: CatalogCategoryTree[];
};

export const useCatalogStore = defineStore("catalog", {
  state: (): State => ({
    categories: [],
    categoryTree: [],
  }),
  actions: {
    async fetchCategories(categorySerchOptions?: CategorySearchOptions) {
      const res =
        await CategoryRepository.searchCategories(categorySerchOptions);
      if (isHttpError(res)) return;
      this.categories = res;
    },

    async fetchCategoryTree() {
      const res = await CategoryRepository.getCategoryTree();
      if (isHttpError(res)) return;
      this.categoryTree = res;
    },

    async createCategory(categoryForm: CategoryForm) {
      const res = await CategoryRepository.createCategory(categoryForm);
      if (isHttpError(res)) return;
      sendSuccessNotification(`La catégorie ${categoryForm.name} a été créée`);
      this.categories = [...this.categories, res];
      await this.fetchCategoryTree();
    },

    async removeCategory(category: CatalogCategoryTree) {
      const res = await CategoryRepository.removeCategory(category.id);
      if (isHttpError(res)) return;
      sendSuccessNotification(`La catégorie ${category.name} a été supprimée`);
      this.categories = this.categories.filter((c) => c.id !== category.id);
      await this.fetchCategoryTree();
    },

    async updateCategory(id: number, categoryForm: CategoryForm) {
      const res = await CategoryRepository.updateCategory(id, categoryForm);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        `La catégorie ${categoryForm.name} a été mise à jour`,
      );

      this.categories = this.categories.map((c) => (c.id === res.id ? res : c));
      await this.fetchCategoryTree();
    },

    async getCategory(
      categoryId: number,
    ): Promise<CatalogCategory | undefined> {
      const storedCategory = this.categories.find((c) => c.id === categoryId);
      if (storedCategory) return storedCategory;

      const res = await CategoryRepository.getCategory(categoryId);
      if (isHttpError(res)) return undefined;
      this.categories = [...this.categories, res];
      return res;
    },
  },
});
