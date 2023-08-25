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
  REMOVE_ENROLLED_NEWCOMERS(
    state,
    newcomers: IDefineANewcomer[],
  ) {
    state.newcomers = state.newcomers.filter(
      (newcomer) =>
        !newcomers.some(
          (enrolledNewcomer) =>
            enrolledNewcomer.id === newcomer.id,
        ),
    );
  }
});

export const actions = actionTree(
  { state },
  {
    async getNewcomers({ commit }) {
      const res = await safeCall(this, repo.getNewcomers(this));
      if (!res) return;
      commit("SET_NEWCOMERS", castNewcomersWithDate(res.data));
    },

    async enrollNewcomers(
      { commit },
      {
        teamCode,
        newcomers,
      }: { teamCode: string; newcomers: IDefineANewcomer[] },
    ) {
      const res = await safeCall(
        this,
        repo.addTeamToNewcomers(this, teamCode, newcomers),
      );
      if (!res) return;
      commit("REMOVE_ENROLLED_NEWCOMERS", newcomers);
    },
  },
);

function castNewcomersWithDate(
  newcomers: HttpStringified<IDefineANewcomer[]>,
): IDefineANewcomer[] {
  return newcomers.map((newcomer) => ({
    ...newcomer,
    registeredAt: new Date(newcomer.registeredAt),
  }));
}
