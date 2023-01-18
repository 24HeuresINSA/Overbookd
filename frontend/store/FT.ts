import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  FTCreation,
  FT,
  FTStatus,
  SearchFT,
  FTTimeWindow,
  FTUpdate,
} from "~/utils/models/ft";
import { Feedback } from "~/utils/models/feedback";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: defaultState() as FT,
  FTs: [] as FT[],
});

export const getters = getterTree(state, {});

export const mutations = mutationTree(state, {
  UPDATE_SELECTED_FT(state, ft: Partial<FT>) {
    state.mFT = { ...ft, ...state.mFT };
  },

  RESET_FT(state) {
    state.mFT = defaultState() as FT;
  },

  UPDATE_STATUS({ mFT }, status: FTStatus) {
    mFT.status = status;
  },

  SET_FTS(state, fts: FT[]) {
    state.FTs = fts;
    console.log(state.FTs, "state.FTs");
  },

  ADD_FT({ FTs }, ft: FT) {
    FTs.push(ft);
  },

  DELETE_FT(state, ftId: number) {
    state.FTs = state.FTs.filter((ft) => ft.id !== ftId);
  },

  ADD_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    mFT.timeWindows = [...mFT.timeWindows, timeWindow];
  },

  UPDATE_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow?.id);
    if (index === -1) return;
    mFT.timeWindows = [
      ...mFT.timeWindows.slice(0, index),
      timeWindow,
      ...mFT.timeWindows.slice(index + 1),
    ];
  },

  DELETE_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    mFT.timeWindows = mFT.timeWindows.filter((tw) => tw.id !== timeWindow.id);
  },

  ADD_FEEDBACK({ mFT }, feedback: Feedback) {
    mFT.feedbacks = [...mFT.feedbacks, feedback];
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

    async fetchFT({ commit }, id: number) {
      const res = await safeCall(this, repo.getFT(this, id));
      if (!res) return null;
      commit("UPDATE_SELECTED_FT", res.data);
      return res.data;
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
      console.log(res, "res");
      if (!res) return;
      commit("ADD_FT", res.data);
      dispatch("setFT", res.data);
    },

    async updateFT({ commit, dispatch }, ft: FT) {
      const adaptedFT: FTUpdate = {
        ...ft,
        team: ft.team?.id,
        inCharge: ft.inCharge?.id,
        fa: ft.fa?.id,
      };
      const res = await safeCall<FT>(this, repo.updateFT(this, adaptedFT), {
        successMessage: "FT sauvegardée 🥳",
        errorMessage: "FT non sauvegardée 😢",
      });
      if (!res) return;
      commit("UPDATE_SELECTED_FT", res.data);
      dispatch("setFT", res.data);
    },

    async deleteFT({ commit }, ft: FT) {
      const res = await safeCall(this, repo.deleteFT(this, ft.id), {
        successMessage: "FT supprimée 🥳",
        errorMessage: "FT non supprimée 😢",
      });
      if (!res) return;
      commit("DELETE_FT", ft.id);
    },

    async restoreFT({ dispatch }, ft: FT) {
      const restoredFT = { ...ft, isDeleted: false };
      dispatch("updateFT", restoredFT);
    },

    async addTimeWindow({ commit }, timeWindow: FTTimeWindow) {
      // await repo.addFTTimeWindows(this, timeWindow);
      commit("ADD_TIME_WINDOW", timeWindow);
    },

    async updateTimeWindow({ commit }, timeWindow: FTTimeWindow) {
      if (!timeWindow?.id) return;
      // await repo.updateFTTimeWindows(this, timeWindow);
      commit("UPDATE_TIME_WINDOW", timeWindow);
    },

    async deleteTimeWindow({ commit }, timeWindow: FTTimeWindow) {
      if (!timeWindow?.id) return;
      // await repo.deleteFTTimeWindows(this, timeWindow);
      commit("DELETE_TIME_WINDOW", timeWindow);
    },

    async addFeedback({ commit }, feedback: Feedback) {
      // await repo.addFTComment(this, comment);
      commit("ADD_FEEDBACK", feedback);
    },
  }
);

function defaultState(): FTCreation {
  return {
    name: "",
  };
}

function fakeFT(id: number): FT {
  return {
    id,
    name: "name",
    description: "",
    areStatic: false,
    feedbacks: [],
    status: FTStatus.DRAFT,
    locations: [],
    timeWindows: [],
    ftRefusals: [],
    ftValidations: [],
    isDeleted: false,
  };
}
