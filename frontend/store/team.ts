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
  getAllTeams(state): team[] {
    return state.teams;
  },
  getTeamNames(state, getters): string[] {
    return getters.getAllTeams.map((team: team) => team.name);
  },
  getTeams:
    (state, getters) =>
    (teamNames: string[] | undefined): any | undefined => {
      if (!teamNames) {
        return undefined;
      }
      return getters.getAllTeams.filter((t: team) => {
        return teamNames.includes(t.name);
      });
    },
});

export const mutations = mutationTree(state, {
  SET_TEAMS(state, teams: any) {
    state.teams = teams.sort((a: team, b: team) =>
      a.name.localeCompare(b.name)
    );
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
