import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Category, CategoryTree, Gear } from "~/utils/models/catalog.model";

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

export const state = (): State => ({
  gears: [],
  categories: [],
  categoryTree: [],
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
    state.gears[index] = gear;
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
});

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
        "saved",
        "server"
      );
      if (!call) return;
      context.commit("ADD_CATEGORY", call.data);

      const categoryTreeCall = await safeCall<CategoryTree[]>(
        this,
        categoryRepository.getCategoryTree(this)
      );
      if (!categoryTreeCall) return;
      context.commit("SET_CATEGORY_TREE", categoryTreeCall.data);
    },

    async createGear(context, gearForm: GearForm): Promise<void> {
      const call = await safeCall<Gear>(
        this,
        gearRepository.createGear(this, gearForm),
        "saved",
        "server"
      );
      if (!call) return;
      context.commit("ADD_GEAR", call.data);
    },
  }
);
