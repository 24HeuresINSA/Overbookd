import {
  CatalogCategory,
  CatalogCategoryTree,
  CategoryForm,
  CategorySearchOptions,
} from "@overbookd/http";
import { actionTree, mutationTree } from "typed-vuex";
import { CategoryRepository } from "~/repositories/catalog.repository";
import { safeCall } from "~/utils/api/calls";
import { SnackNotif } from "~/utils/notification/snack";

type State = {
  categories: CatalogCategory[];
  categoryTree: CatalogCategoryTree[];
};

export type CategoryUpdateForm = CategoryForm & {
  id: number;
};

export const state = (): State => ({
  categories: [],
  categoryTree: [],
});

export const mutations = mutationTree(state, {
  SET_CATEGORIES(state, categories: CatalogCategory[]) {
    state.categories = categories;
  },
  SET_CATEGORY_TREE(state, categoryTree: CatalogCategoryTree[]) {
    state.categoryTree = categoryTree;
  },
  ADD_CATEGORY(state, category: CatalogCategory) {
    state.categories.push(category);
  },
  DELETE_CATEGORY(state, category: CatalogCategory) {
    state.categories = state.categories.filter((c) => c.id !== category.id);
  },
  UPDATE_CATEGORY(state, category: CatalogCategory) {
    const index = state.categories.findIndex((c) => c.id === category.id);
    if (index < 0) return;
    state.categories.splice(index, 1, category);
  },
});

const DEFAULT_ERROR = "Quelque chose s'est mal passé";
export const actions = actionTree(
  { state, mutations },
  {
    async fetchCategories(
      context,
      categorySerchOptions: CategorySearchOptions,
    ): Promise<void> {
      const call = await safeCall<CatalogCategory[]>(
        this,
        CategoryRepository.searchCategories(this, categorySerchOptions),
      );
      if (!call) return;
      context.commit("SET_CATEGORIES", call.data);
    },

    async fetchCategoryTree(context): Promise<void> {
      const call = await safeCall<CatalogCategoryTree[]>(
        this,
        CategoryRepository.getCategoryTree(this),
      );
      if (!call) return;
      context.commit("SET_CATEGORY_TREE", call.data);
    },

    async createCategory(context, categoryForm: CategoryForm): Promise<void> {
      const call = await safeCall<CatalogCategory>(
        this,
        CategoryRepository.createCategory(this, categoryForm),
        {
          successMessage: "La categorie a ete cree avec succes",
          errorMessage: "Erreur lors de la creation de la categorie",
        },
      );
      if (!call) return;
      context.commit("ADD_CATEGORY", call.data);
      this.dispatch("catalog/fetchCategoryTree");
    },

    async deleteCategory(context, category: CatalogCategory): Promise<void> {
      try {
        await CategoryRepository.deleteCategory(this, category.id);
        sendNotification(this, `${category.name} supprime`);
        context.commit("DELETE_CATEGORY", category);
        this.dispatch("catalog/fetchCategoryTree");
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : DEFAULT_ERROR;
        sendNotification(this, message);
      }
    },

    async updateCategory(context, form: CategoryUpdateForm): Promise<void> {
      const { id, ...categoryForm } = form;
      const call = await safeCall<CatalogCategory>(
        this,
        CategoryRepository.updateCategory(this, id, categoryForm),
        {
          successMessage: "La categorie a ete mise a jour avec succes",
          errorMessage: "Erreur lors de la mise a jour de la categorie",
        },
      );
      if (!call) return;
      context.commit("UPDATE_CATEGORY", call.data);
      this.dispatch("catalog/fetchCategoryTree");
    },

    async fetchCategory(
      context,
      categoryId: number,
    ): Promise<CatalogCategory | undefined> {
      const storedCategory = context.state.categories.find(
        (category) => category.id === categoryId,
      );
      if (storedCategory) return storedCategory;
      const call = await safeCall<CatalogCategory>(
        this,
        CategoryRepository.getCategory(this, categoryId),
      );
      if (!call) return undefined;
      context.commit("ADD_CATEGORY", call.data);
      return call.data;
    },
  },
);

export function sendNotification(store: Vue["$store"], message: string) {
  const notif: SnackNotif = { message };
  store.dispatch("notif/pushNotification", notif);
}
