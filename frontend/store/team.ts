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
  teams(state): team[] {
    return state.teams;
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
    async getTeams(context): Promise<any> {
      const res = await safeCall(this, teamRepo.getTeams(this));
      if (res) {
        context.commit("SET_TEAMS", res);
      }
      return res;
    },
    async linkUserToTeams(userId: number, teams: team[]) {
      return await safeCall(
        this,
        teamRepo.linkUserToTeams(this, userId, teams)
      );
    },
  }
);
