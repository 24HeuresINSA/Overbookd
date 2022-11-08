import { actionTree, getAccessorType, mutationTree } from "typed-vuex";

// Import all submodules
import * as dialog from "./dialog";
import * as notif from "./notif";
import * as config from "./config";
import * as user from "./user";
import * as transaction from "./transaction";
import * as FA from "./FA";
import * as FT from "./FT";
import * as timeslot from "./timeslot";
import * as location from "./location";
import * as equipment from "./equipment";
import * as equipmentProposal from "./equipmentProposal";
import * as assignment from "./assignment";
import * as conflict from "./conflict";
import * as team from "./team";

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
    FA,
    FT,
    team,
    timeslot,
    location,
    equipment,
    equipmentProposal,
    assignment,
    conflict,
  },
});
