import { actionTree, getAccessorType, mutationTree } from "typed-vuex";

// Import all submodules
import * as assignment from "./assignment";
import * as catalog from "./catalog";
import * as config from "./config";
import * as configuration from "./configuration";
import * as conflict from "./conflict";
import * as dialog from "./dialog";
import * as equipment from "./equipment";
import * as equipmentProposal from "./equipmentProposal";
import * as FA from "./FA";
import * as FT from "./FT";
import * as location from "./location";
import * as notif from "./notif";
import * as publishAnimation from "./publishAnimation";
import * as signaLocation from "./signaLocation";
import * as team from "./team";
import * as timeslot from "./timeslot";
import * as transaction from "./transaction";
import * as user from "./user";
import * as permission from "./permission";

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
    catalog,
    configuration,
    signaLocation,
    publishAnimation,
    permission,
  },
});
