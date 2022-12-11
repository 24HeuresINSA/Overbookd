import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { team } from "~/utils/models/repo";
import { safeCall } from "~/utils/api/calls";

const teamRepo = RepoFactory.teamRepo;

// The state types definitions
interface State {
  teams: team[];
}

export const state = (): State => ({
  teams: [],
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
  getTeamByCode:
    (state, getters) =>
    (code: string): team => {
      return getters.allTeams.find((t: team) => t.code === code);
    },
});

export const mutations = mutationTree(state, {
  SET_TEAMS(state, teams: any) {
    state.teams = teams;
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
  }
);
