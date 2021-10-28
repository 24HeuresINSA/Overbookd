import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { FT } from "~/utils/models/FT";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: {
    status: "draft",
    count: 0,
    equipments: [] as any,
    timeframes: [] as any,
    validated: [] as any,
    refused: [] as any,
  } as FT,
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  SET_FT: function (state, mFT) {
    state.mFT = mFT;
  },
  ASSIGN_FT: function ({ mFT }, data) {
    const key = Object.keys(data)[0] as keyof FT;
    if (!mFT[key]) {
      mFT[key] = data[key] as never;
    } else {
      Object.assign(mFT[key], data[key]);
    }
  },
});

export const actions = actionTree(
  { state },
  {
    getAndSetFT: async function ({ commit }, count: number) {
      // get FT
      const res = await safeCall(this, repo.getFT(this, count.toString()));
      if (res) {
        commit("SET_FT", res.data);
        return res.data;
      }
    },
    saveFT: async function ({ state }) {
      return safeCall(this, repo.updateFT(this, state.mFT));
    },
    assignFT: function ({ commit }, payload) {
      commit("ASSIGN_FT", payload);
    },
  }
);
