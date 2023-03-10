import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { Team } from "~/utils/models/team";
import { safeCall } from "~/utils/api/calls";

const teamRepo = RepoFactory.teamRepo;

// The state types definitions
interface State {
  teams: Team[];
  faValidators: Team[];
  ftValidators: Team[];
}

export const state = (): State => ({
  teams: [],
  faValidators: [] as Team[],
  ftValidators: [] as Team[],
});

export const getters = getterTree(state, {
  allTeams(state): Team[] {
    return state.teams;
  },
  teamNames(state, getters): string[] {
    return getters.allTeams.map((team: Team) => team.name);
  },
  getTeams:
    (state, getters) =>
    (teamCodes: string[]): Team[] => {
      return getters.allTeams.filter((t: Team) => {
        return teamCodes.includes(t.code);
      });
    },
  getTeamById:
    (state) =>
    (id: number): Team | undefined => {
      return state.teams.find((t) => t.id === id);
    },
  getTeamByCode:
    (state, getters) =>
    (code: string): Team => {
      return getters.allTeams.find((t: Team) => t.code === code);
    },
  softCreationTeams(state): Team[] {
    const teamsCodes = [
      "bde",
      "kfet",
      "karna",
      "woods",
      "teckos",
      "tendrestival",
    ];
    return state.teams.filter((t) => teamsCodes.includes(t.code));
  },
});

export const mutations = mutationTree(state, {
  SET_TEAMS(state, teams: Team[]) {
    state.teams = teams;
  },
  SET_FA_VALIDATORS(state, teams: Team[]) {
    state.faValidators = teams;
  },
  SET_FT_VALIDATORS(state, teams: Team[]) {
    state.ftValidators = teams;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async setTeamsInStore(context): Promise<any> {
      const res = await safeCall(this, teamRepo.getTeams(this));
      if (res) {
        context.commit("SET_TEAMS", res.data);
      }
      return res;
    },

    async fetchFaValidators(context): Promise<void> {
      const res = await safeCall(this, teamRepo.getFaValidators(this));
      if (!res) {
        return;
      }
      context.commit("SET_FA_VALIDATORS", res.data);
    },

    async fetchFtValidators(context): Promise<void> {
      const res = await safeCall(this, teamRepo.getFtValidators(this));
      if (!res) return;
      context.commit("SET_FT_VALIDATORS", res.data);
    },
  }
);
