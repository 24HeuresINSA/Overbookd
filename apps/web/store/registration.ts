import { IDefineANewcomer, JoinableTeam } from "@overbookd/registration";
import { actionTree, mutationTree } from "typed-vuex";
import { FakeRegistrationRepository } from "~/repositories/registration.repository";
import { HttpStringified } from "~/utils/types/http";

type State = {
  newcomers: IDefineANewcomer[];
};

const repo = FakeRegistrationRepository;

export const state = (): State => ({
  newcomers: [],
});

export const mutations = mutationTree(state, {
  SET_NEWCOMERS(state, newcomers: IDefineANewcomer[]) {
    state.newcomers = newcomers;
  },
  REMOVE_ENROLLED_NEWCOMERS(state, newcomers: IDefineANewcomer[]) {
    state.newcomers = state.newcomers.filter(
      (newcomer) =>
        !newcomers.some(
          (enrolledNewcomer) => enrolledNewcomer.id === newcomer.id,
        ),
    );
  },
});

export const actions = actionTree(
  { state },
  {
    async getNewcomers({ commit }) {
      const res = await repo.getNewcomers(this);
      commit("SET_NEWCOMERS", castNewcomersWithDate(res));
    },

    async enrollNewcomers(
      { commit },
      {
        team,
        newcomers,
      }: { team: JoinableTeam; newcomers: IDefineANewcomer[] },
    ) {
      await repo.enrollNewcomers(team, newcomers);
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
