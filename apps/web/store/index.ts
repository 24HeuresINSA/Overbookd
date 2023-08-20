import { actionTree, getAccessorType, mutationTree } from "typed-vuex";

// Import all submodules
import * as assignment from "./assignment";
import * as catalog from "./catalog";
import * as charismaPeriod from "./charisma-period";
import * as configuration from "./configuration";
import * as dialog from "./dialog";
import * as fa from "./fa";
import * as ft from "./ft";
import * as gearRequest from "./gear-request";
import * as inventory from "./inventory";
import * as needHelp from "./need-help";
import * as notif from "./notif";
import * as orgaNeeds from "./orga-needs";
import * as permission from "./permission";
import * as planning from "./planning";
import * as publicAnimation from "./public-animation";
import * as signa from "./signa";
import * as stats from "./stats";
import * as team from "./team";
import * as theme from "./theme";
import * as timeline from "./timeline";
import * as transaction from "./transaction";
import * as user from "./user";
import * as volunteerAvailability from "./volunteer-availability";

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
    user,
    transaction,
    fa,
    ft,
    team,
    assignment,
    catalog,
    configuration,
    signa,
    publicAnimation,
    permission,
    stats,
    inventory,
    gearRequest,
    charismaPeriod,
    volunteerAvailability,
    theme,
    planning,
    orgaNeeds,
    timeline,
    needHelp,
  },
});
