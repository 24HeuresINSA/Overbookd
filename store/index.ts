import { actionTree, getAccessorType, mutationTree } from "typed-vuex";

// Import all submodules
import * as dialog from "./dialog";
import * as notif from "./notif";
import * as config from "./config";
import * as user from "./user";
import * as transaction from "./transaction";

export const state = () => ({});

export const getters = {};

export const mutations = mutationTree(state, {});

export const actions = actionTree({ state, getters, mutations }, {});

export type RootState = ReturnType<typeof state>;

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    dialog,
    notif,
    config,
    user,
    transaction,
  },
});
