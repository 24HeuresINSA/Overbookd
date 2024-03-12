import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { GearRepository } from "~/domain/inventory/gear.repository";
import { InMemoryGearRepository } from "~/domain/inventory/inmemory-gear.repository";
import { safeCall } from "~/utils/api/calls";
import { Gear } from "~/utils/models/catalog.model";
import { GearSearchOptions } from "@overbookd/http";
import { GearsRepository } from "~/repositories/catalog.repository";

interface State {
  gears: Gear[];
}

export interface GearForm {
  name: string;
  category?: number;
  isPonctualUsage: boolean;
  isConsumable: boolean;
}

interface GearUpdateForm extends GearForm {
  id: number;
}

export const state = (): State => ({
  gears: [],
});

export const getters = getterTree(state, {
  gearRepository(state): GearRepository {
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
  UPDATE_GEAR(state, gear: Gear) {
    const index = state.gears.findIndex((g) => g.id === gear.id);
    if (index < 0) return;
    state.gears.splice(index, 1, gear);
  },
  DELETE_GEAR(state, gear: Gear) {
    state.gears = state.gears.filter((g) => g.id !== gear.id);
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchGears(
      { commit },
      gearSearchOptions: GearSearchOptions,
    ): Promise<void> {
      const res = await safeCall<Gear[]>(
        this,
        GearsRepository.searchGears(this, gearSearchOptions),
      );
      if (!res) return;
      commit("SET_GEARS", res.data);
    },

    async createGear({ commit }, gearForm: GearForm): Promise<void> {
      const res = await safeCall<Gear>(
        this,
        GearsRepository.createGear(this, gearForm),
        {
          successMessage: "Le matériel a été créé avec succès",
          errorMessage: "Erreur lors de la création du matériel",
        },
      );
      if (!res) return;
      commit("ADD_GEAR", res.data);
    },

    async updateGear({ commit }, form: GearUpdateForm): Promise<void> {
      const { id, ...gearForm } = form;
      const res = await safeCall<Gear>(
        this,
        GearsRepository.updateGear(this, id, gearForm),
        {
          successMessage: "Le matériel a été mis a jour avec succès",
          errorMessage: "Erreur lors de la mise à jour du matériel",
        },
      );
      if (!res) return;
      commit("UPDATE_GEAR", res.data);
    },

    async deleteGear({ commit }, gear: Gear): Promise<void> {
      const res = await safeCall(
        this,
        GearsRepository.deleteGear(this, gear.id),
        {
          successMessage: `${gear.name} supprimé avec succès`,
          errorMessage: `Erreur lors de la suppression de ${gear.name}`,
        },
      );
      if (!res) return;
      commit("DELETE_GEAR", gear);
    },
  },
);
