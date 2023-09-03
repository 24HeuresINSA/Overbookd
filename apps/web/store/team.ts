import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { Team } from "~/utils/models/team.model";
import { safeCall } from "~/utils/api/calls";

const teamRepo = RepoFactory.TeamRepository;

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
  getTeamByCode:
    (state, getters) =>
    (code: string): Team => {
      return getters.allTeams.find((t: Team) => t.code === code);
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
    async fetchTeams({ commit }): Promise<void> {
      const res = await safeCall(this, teamRepo.getTeams(this));
      if (!res) return;
      commit("SET_TEAMS", res.data);
    },

    async fetchFaValidators({ commit }): Promise<void> {
      const res = await safeCall(this, teamRepo.getFaValidators(this));
      if (!res) return;
      commit("SET_FA_VALIDATORS", res.data);
    },

    async fetchFtValidators({ commit }): Promise<void> {
      const res = await safeCall(this, teamRepo.getFtValidators(this));
      if (!res) return;
      commit("SET_FT_VALIDATORS", res.data);
    },

    async createTeam({ dispatch }, team: Team): Promise<void> {
      await safeCall(this, teamRepo.createTeam(this, team), {
        successMessage: "Equipe créée avec succès ✅",
      });
      await dispatch("fetchTeams");
    },

    async updateTeam({ dispatch }, team: Team): Promise<void> {
      await safeCall(this, teamRepo.updateTeam(this, team), {
        successMessage: "Equipe modifiée avec succès ✅",
      });
      await dispatch("fetchTeams");
    },

    async removeTeam({ dispatch }, { code }: Team): Promise<void> {
      await safeCall(this, teamRepo.deleteTeam(this, code), {
        successMessage: "Equipe supprimée avec succès ✅",
      });
      await dispatch("fetchTeams");
    },
  },
);
