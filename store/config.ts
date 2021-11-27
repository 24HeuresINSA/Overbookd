const configsData = require("../config/configs.json");
import { getterTree, mutationTree, actionTree } from "typed-vuex";
import configRepo from "../repositories/configRepo";
import { safeCall } from "~/utils/api/calls";

export const state = () => ({
  data: {
    data: configsData,
  },
});

export const getters = getterTree(state, {
  getConfig: (state) => (key: string) => {
    if (state.data && state.data.data) {
      const config = state.data.data.find((o: any) => o.key === key);
      if (config) {
        return config.value;
      } else {
        return;
      }
    }
  },

  /**
   * GET teams with matching name from config
   * @param state The config state
   * @returns Array of team stored in config that match team names
   */
  getConfigTeams:
    (state) =>
    (teamNames: string[] | undefined): any | undefined => {
      if (!teamNames) {
        return undefined;
      }
      if (state.data && state.data.data) {
        const allConfigTeams = state.data.data.find(
          (o: any) => o.key == "teams"
        );
        if (!allConfigTeams) {
          return undefined;
        }
        return allConfigTeams.value.filter((t: any) => {
          return teamNames.includes(t.name);
        });
      }
      return undefined;
    },
  /**
   * GET teams from config
   * @param state The config state
   * @returns All teams stored in config
   */
  getAllConfigTeams: (state) => {
    if (state.data && state.data.data) {
      const teams = state.data.data.find((o: any) => o.key == "teams");
      if (teams) {
        return teams;
      }
    }
    return undefined;
  },
});

export type ConfigState = ReturnType<typeof state>;

export const mutations = mutationTree(state, {
  SET_CONFIG(state, data) {
    state.data = data;
  },
  SET_ONE_CONFIG(state, data: { key: string; value: any }) {
    const config = state.data.data.find((o: any) => o.key == data.key);
    if (config) {
      config.value = data.value;
    } else {
      state.data.data.push(data);
    }
  },
});

export const actions = actionTree(
  { state },
  {
    async setConfig({ commit }, data: { key: string; value: any }) {
      const resp = await safeCall(this, configRepo.setConfig(this, data));
      commit("SET_ONE_CONFIG", data);
    },
  }
);
