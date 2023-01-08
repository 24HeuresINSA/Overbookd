import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { GearRepository as InventoryGearRepository } from "~/domain/inventory/gear.repository";
import { InMemoryGearRepository } from "~/domain/inventory/inmemory-gear.repository";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Category, CategoryTree, Gear } from "~/utils/models/catalog.model";
import { SnackNotif } from "~/utils/models/store";

const gearRepository = RepoFactory.GearsRepository;
const categoryRepository = RepoFactory.CategoryRepository;

interface State {
  gears: Gear[];
  categories: Category[];
  categoryTree: CategoryTree[];
}

export interface GearSearchOptions {
  name?: string;
  category?: string;
  owner?: string;
}

export interface GearForm {
  name: string;
  category?: number;
  isPonctualUsage: boolean;
}

export interface GearUpdateForm extends GearForm {
  id: number;
}

export interface CategorySearchOptions {
  name?: string;
  owner?: string;
}

export interface CategoryForm {
  name: string;
  owner?: string;
  parent?: number;
}

export interface CategoryUpdateForm extends CategoryForm {
  id: number;
}

export const state = (): State => ({
  gears: [],
  categories: [],
  categoryTree: [],
});

export const getters = getterTree(state, {
  gearRepository(state): InventoryGearRepository {
    return new InMemoryGearRepository(state.gears);
  },
});

export const mutations = mutationTree(state, {
  SET_GEARS(state, gears: Gear[]) {
    state.gears = gears;
  },
  ADD_GEAR(state, gear: Gear) {
    state.gears.push(gear);
  },
  DELETE_GEAR(state, gear: Gear) {
    state.gears = state.gears.filter((g) => g.id !== gear.id);
  },
  UPDATE_GEAR(state, gear: Gear) {
    const index = state.gears.findIndex((g) => g.id === gear.id);
    if (index < 0) return;
    state.gears.splice(index, 1, gear);
  },
  SET_CATEGORIES(state, categories: Category[]) {
    state.categories = categories;
  },
  SET_CATEGORY_TREE(state, categoryTree: CategoryTree[]) {
    state.categoryTree = categoryTree;
  },
  ADD_CATEGORY(state, category: Category) {
    state.categories.push(category);
  },
  DELETE_CATEGORY(state, category: Category) {
    state.categories = state.categories.filter((c) => c.id !== category.id);
  },
  UPDATE_CATEGORY(state, category: Category) {
    const index = state.categories.findIndex((c) => c.id === category.id);
    if (index < 0) return;
    state.categories.splice(index, 1, category);
  },
});

const DEFAULT_ERROR = "Quelque chose s'est mal passe";
export const actions = actionTree(
  { state, mutations },
  {
    async fetchGears(
      context,
      gearSerchOptions: GearSearchOptions
    ): Promise<void> {
      const call = await safeCall<Gear[]>(
        this,
        gearRepository.searchGears(this, gearSerchOptions)
      );
      if (!call) return;
      context.commit("SET_GEARS", call.data);
    },

    async fetchCategories(
      context,
      categorySerchOptions: CategorySearchOptions
    ): Promise<void> {
      const call = await safeCall<Category[]>(
        this,
        categoryRepository.searchCategories(this, categorySerchOptions)
      );
      if (!call) return;
      context.commit("SET_CATEGORIES", call.data);
    },

    async fetchCategoryTree(context): Promise<void> {
      const call = await safeCall<CategoryTree[]>(
        this,
        categoryRepository.getCategoryTree(this)
      );
      if (!call) return;
      context.commit("SET_CATEGORY_TREE", call.data);
    },

    async createCategory(context, categoryForm: CategoryForm): Promise<void> {
      const call = await safeCall<Category>(
        this,
        categoryRepository.createCategory(this, categoryForm),
        {
          successMessage: "La categorie a ete cree avec succes",
          errorMessage: "Erreur lors de la creation de la categorie",
        }
      );
      if (!call) return;
      context.commit("ADD_CATEGORY", call.data);
      this.dispatch("catalog/fetchCategoryTree");
    },

    async createGear(context, gearForm: GearForm): Promise<void> {
      const call = await safeCall<Gear>(
        this,
        gearRepository.createGear(this, gearForm),
        {
          successMessage: "Le materiel a ete cree avec succes",
          errorMessage: "Erreur lors de la creation du materiel",
        }
      );
      if (!call) return;
      context.commit("ADD_GEAR", call.data);
    },

    async updateGear(context, form: GearUpdateForm): Promise<void> {
      const { id, ...gearForm } = form;
      const call = await safeCall<Gear>(
        this,
        gearRepository.updateGear(this, id, gearForm),
        {
          successMessage: "Le materiel a ete mis a jour avec succes",
          errorMessage: "Erreur lors de la mise a jour du materiel",
        }
      );
      if (!call) return;
      context.commit("UPDATE_GEAR", call.data);
    },

    async deleteGear(context, gear: Gear): Promise<void> {
      try {
        await gearRepository.deleteGear(this, gear.id);
        sendNotification(this, `${gear.name} supprime`);
        context.commit("DELETE_GEAR", gear);
      } catch (error: any) {
        sendNotification(this, error.message ?? DEFAULT_ERROR);
      }
    },

    async deleteCategory(context, category: Category): Promise<void> {
      try {
        await categoryRepository.deleteCategory(this, category.id);
        sendNotification(this, `${category.name} supprime`);
        context.commit("DELETE_CATEGORY", category);
        this.dispatch("catalog/fetchCategoryTree");
      } catch (error: any) {
        sendNotification(this, error.message ?? DEFAULT_ERROR);
      }
    },

    async updateCategory(context, form: CategoryUpdateForm): Promise<void> {
      const { id, ...categoryForm } = form;
      const call = await safeCall<Category>(
        this,
        categoryRepository.updateCategory(this, id, categoryForm),
        {
          successMessage: "La categorie a ete mise a jour avec succes",
          errorMessage: "Erreur lors de la mise a jour de la categorie",
        }
      );
      if (!call) return;
      context.commit("UPDATE_CATEGORY", call.data);
      this.dispatch("catalog/fetchCategoryTree");
    },

    async fetchCategory(
      context,
      categoryId: number
    ): Promise<Category | undefined> {
      const storedCategory = context.state.categories.find(
        (category) => category.id === categoryId
      );
      if (storedCategory) return storedCategory;
      const call = await safeCall<Category>(
        this,
        categoryRepository.getCategory(this, categoryId)
      );
      if (!call) return undefined;
      context.commit("ADD_CATEGORY", call.data);
      return call.data;
    },
  }
);

export function sendNotification(store: Vue["$store"], message: string) {
  const notif: SnackNotif = {
    message,
  };
  store.dispatch("notif/pushNotification", notif);
}
