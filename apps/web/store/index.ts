import { actionTree, getAccessorType, mutationTree } from "typed-vuex";

// Import all submodules
import * as assignment from "./assignment";
import * as catalog from "./catalog";
import * as catalogGear from "./catalogGear";
import * as catalogSignage from "./catalogSignage";
import * as charismaPeriod from "./charismaPeriod";
import * as configuration from "./configuration";
import * as dialog from "./dialog";
import * as festivalActivity from "./festivalActivity";
import * as festivalTask from "./festivalTask";
import * as gearRequest from "./gearRequest";
import * as inventory from "./inventory";
import * as needHelp from "./needHelp";
import * as notification from "./notification";
import * as notif from "./notif";
import * as orgaNeeds from "./orgaNeeds";
import * as permission from "./permission";
import * as planning from "./planning";
import * as registration from "./registration";
import * as signa from "./signa";
import * as stats from "./stats";
import * as team from "./team";
import * as theme from "./theme";
import * as timeline from "./timeline";
import * as transaction from "./transaction";
import * as user from "./user";
import * as volunteerAvailability from "./volunteerAvailability";
import * as contribution from "./contribution";
import * as alert from "./alert";
import * as personalAccount from "./personalAccount";
import * as mealSharing from "./mealSharing";
import * as logisticDashboard from "./logisticDashboard";
import * as publicHoliday from "./publicHoliday";
import * as preference from "./preference";

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
    notification,
    user,
    transaction,
    festivalActivity,
    festivalTask,
    team,
    assignment,
    catalog,
    catalogGear,
    catalogSignage,
    configuration,
    signa,
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
    registration,
    contribution,
    alert,
    personalAccount,
    mealSharing,
    logisticDashboard,
    publicHoliday,
    preference,
  },
});
