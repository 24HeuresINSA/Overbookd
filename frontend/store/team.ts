import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { team } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const teamRepo = RepoFactory.teamRepo;

// The state types definitions
interface State {
  teams: team[];
  faValidators: team[];
}

export const state = (): State => ({
  teams: [],
  faValidators: [] as team[],
});

export const getters = getterTree(state, {
  allTeams(state): team[] {
    return state.teams;
  },
  teamNames(state, getters): string[] {
    return getters.allTeams.map((team: team) => team.name);
  },
  getTeams:
    (state, getters) =>
    (teamCodes: string[]): team[] => {
      return getters.allTeams.filter((t: team) => {
        return teamCodes.includes(t.code);
      });
    },
  getTeamById:
    (state) =>
    (id: number): team | undefined => {
      return state.teams.find((t) => t.id === id);
    },
  getTeamByCode:
    (state) =>
    (code: string): team | undefined => {
      return state.teams.find((t: team) => t.code === code);
    },
});

export const mutations = mutationTree(state, {
  SET_TEAMS(state, teams: team[]) {
    state.teams = teams;
  },
  SET_FA_VALIDATORS(state, teams: team[]) {
    state.faValidators = teams;
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
    async linkUserToTeams(
      constext,
      { userId, teams }: { userId: number; teams: team[] }
    ): Promise<any> {
      return safeCall(this, teamRepo.linkUserToTeams(this, userId, teams));
    },
    async fetchFaValidators(context): Promise<void> {
      const res = await safeCall(this, teamRepo.getFaValidators(this));
      if (!res) {
        return;
      }
      context.commit("SET_FA_VALIDATORS", res.data);
    },
  }
);
