import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { FTCreation, FT, FTStatus, SearchFT } from "~/utils/models/ft";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: defaultState() as FT,
  FTs: [] as FT[],
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  UPDATE_SELECTED_FT(state, ft: Partial<FT>) {
    state.mFT = { ...state.mFT, ...ft };
  },

  RESET_FT(state) {
    state.mFT = defaultState() as FT;
  },

  UPDATE_STATUS({ mFT }, status: FTStatus) {
    mFT.status = status;
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
      commit("UPDATE_SELECTED_FT", ft);
    },

    resetFT({ commit }) {
      commit("RESET_FT");
    },

    fetchFT({ commit }, id: number) {
      commit("UPDATE_SELECTED_FT", fakeFT(id));
    },

    async fetchFTs({ commit }, search?: SearchFT) {
      const res = await safeCall<FT[]>(this, repo.getAllFTs(this, search), {
        errorMessage: "Impossible de charger les FTs",
      });
      if (!res) return;
      commit("SET_FTS", res.data);
    },

    async createFT({ commit, dispatch }, ft: FTCreation) {
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

function defaultState(): FTCreation {
  return {
    name: "",
    status: FTStatus.DRAFT,
    description: "",
  };
}

function fakeFT(id: number): FT {
  return {
    id,
    name: "name",
    description: "",
    areStatic: false,
    ftComments: [],
    status: FTStatus.DRAFT,
    ftRefusals: [],
    ftValidations: [],
    locations: [],
    timeWindows: [],
  };
}
