import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { CreateFT, FT, FTStatus, SearchFT } from "~/utils/models/FT";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: {
    status: FTStatus.DRAFT,
    name: "",
  } as FT,
  FTs: [] as FT[],
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  SET_FT(state, ft: Partial<FT>) {
    state.mFT = { ...state.mFT, ...ft };
  },

  RESET_FT(state) {
    state.mFT = {
      status: FTStatus.DRAFT,
      name: "",
    } as FT;
  },

  UPDATE_STATUS({ mFT }, status: FTStatus) {
    mFT.status = status;
  },

  UPDATE_FT({ mFT }, { key, value }) {
    if (typeof mFT[key as keyof FT] !== "undefined") {
      mFT[key as keyof FT] = value as never;
    }
  },

  SET_FTS(state, fts: FT[]) {
    state.FTs = fts;
  },

  ADD_FT({ FTs }, ft: FT) {
    FTs.push(ft);
  },

  DELETE_FT(state, ftId: number) {
    state.FTs = state.FTs.filter((ft) => ft.id !== ftId);
  },
});

export const actions = actionTree(
  { state },
  {
    setFT({ commit }, ft: FT) {
      commit("SET_FT", ft);
    },

    resetFT({ commit }) {
      commit("RESET_FT");
    },

    getAndSetFT: async function ({ commit }, id: number) {
      const resFT = await safeCall(this, repo.getFT(this, id));
      if (!resFT) return null;
      commit("SET_FT", resFT.data);
      return resFT.data;
    },

    updateFT({ commit }, { key, value }) {
      commit("UPDATE_FT", { key, value });
    },

    async fetchFTs({ commit }, search?: SearchFT) {
      const res = await safeCall<FT[]>(this, repo.getAllFTs(this, search), {
        errorMessage: "Impossible de charger les FTs",
      });
      if (!res) return;
      commit("SET_FTS", res.data);
    },

    async createFT({ commit, dispatch }, ft: CreateFT) {
      const res = await safeCall<FT>(this, repo.createFT(this, ft), {
        successMessage: "FT créée 🥳",
        errorMessage: "FT non créée 😢",
      });
      if (!res) return;
      commit("ADD_FT", res.data);
      dispatch("setFT", res.data);
    },

    async deleteFT({ commit }, ftId: number) {
      const res = await safeCall(this, repo.deleteFT(this, ftId), {
        successMessage: "FT supprimée 🥳",
        errorMessage: "FT non supprimée 😢",
      });
      if (!res) return;
      commit("DELETE_FT", ftId);
    },
  }
);
