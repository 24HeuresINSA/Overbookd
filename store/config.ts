const configsData = require("../config/configs.json");
import { getterTree, mutationTree } from "typed-vuex";

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
});
