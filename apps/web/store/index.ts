import { actionTree, getAccessorType, mutationTree } from "typed-vuex";

// Import all submodules
import * as assignment from "./assignment.store";
import * as catalog from "./catalog.store";
import * as charismaPeriod from "./charisma-period.store";
import * as configuration from "./configuration.store";
import * as dialog from "./dialog.store";
import * as fa from "./fa.store";
import * as ft from "./ft.store";
import * as gearRequest from "./gear-request.store";
import * as inventory from "./inventory.store";
import * as needHelp from "./need-help.store";
import * as notif from "./notif.store";
import * as orgaNeeds from "./orga-needs.store";
import * as permission from "./permission.store";
import * as planning from "./planning.store";
import * as publicAnimation from "./public-animation.store";
import * as signa from "./signa.store";
import * as stats from "./stats.store";
import * as team from "./team.store";
import * as theme from "./theme.store";
import * as timeline from "./timeline.store";
import * as transaction from "./transaction.store";
import * as user from "./user.store";
import * as volunteerAvailability from "./volunteer-availability.store";

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
