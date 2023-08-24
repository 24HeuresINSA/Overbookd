import { IDefineANewcomer } from "@overbookd/registration";
import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { HttpStringified } from "~/utils/types/http";

type State = {
  newcomers: IDefineANewcomer[];
};

const repo = RepoFactory.RegistrationRepository;

export const state = (): State => ({
  newcomers: [],
});

export const mutations = mutationTree(state, {
  SET_NEWCOMERS(state, newcomers: IDefineANewcomer[]) {
    state.newcomers = newcomers;
  },
});

export const actions = actionTree({ state }, {
    async getNewcomers({ commit }) {
      const res = await safeCall(this, repo.getNewcomers(this))
      if (!res) return;
      commit("SET_NEWCOMERS", castNewComersWithDate(res.data));
    },
  },
);

function castNewComersWithDate(newcomers: HttpStringified<IDefineANewcomer[]>): IDefineANewcomer[] {
  return newcomers.map((newcomer) => ({
    ...newcomer,
    registeredAt: new Date(newcomer.registeredAt),
  }));
}
