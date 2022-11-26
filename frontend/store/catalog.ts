import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Gear } from "~/utils/models/catalog.model";

const repository = RepoFactory.GearsRepository;

interface State {
  gears: Gear[];
}

export interface GearSearchOptions {
  name?: string;
  category?: string;
  owner?: string;
}

export const state = (): State => ({
  gears: [],
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
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchGears(
      context,
      gearSerchOptions: GearSearchOptions
    ): Promise<void> {
      const call = await safeCall(
        this,
        repository.searchGears(this, gearSerchOptions)
      );
      if (!call) return;
      context.commit("SET_GEARS", call.data);
    },
  }
);
