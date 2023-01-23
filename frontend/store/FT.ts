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
  FTTimeWindowUpdate,
  castFTWithDate,
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
    const completeFT = { ...state.mFT, ...ft };
    state.mFT = castFTWithDate(completeFT);
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

  ADD_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    mFT.timeWindows = [...mFT.timeWindows, timeWindow];
  },

  UPDATE_TIME_WINDOW({ mFT }, timeWindow: FTTimeWindow) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    console.log("index", index);
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
      dispatch("setFT", { ...fakeFT(res.data.id), ...res.data });
    },

    async updateFT({ commit }, ft: FT) {
      const adaptedFT: FTUpdate = {
        id: ft.id,
        name: ft.name,
        parentFaId: ft.fa?.id ?? null,
        isStatic: ft.isStatic,
        description: ft.description,
        userInChargeId: ft.userInCharge?.id ?? null,
        teamCode: ft.Team?.code ?? null,
        locationId: ft.location?.id ?? null,
      };

      const res = await safeCall<FT>(this, repo.updateFT(this, adaptedFT), {
        successMessage: "FT sauvegardée 🥳",
        errorMessage: "FT non sauvegardée 😢",
      });

      if (!res) return;
      commit("UPDATE_SELECTED_FT", res.data);
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

    async addTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      commit("ADD_TIME_WINDOW", timeWindow);
      const adaptedTimeWindows: FTTimeWindowUpdate[] =
        state.mFT.timeWindows.map((tw) => ({
          id: tw.id,
          start: tw.start,
          end: tw.end,
          sliceTime: tw.sliceTime,
        }));
      await repo.updateFTTimeWindows(this, state.mFT.id, adaptedTimeWindows);
    },

    async updateTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      commit("UPDATE_TIME_WINDOW", timeWindow);
      const adaptedTimeWindows: FTTimeWindowUpdate[] =
        state.mFT.timeWindows.map((tw) => ({
          id: tw.id,
          start: tw.start,
          end: tw.end,
          sliceTime: tw.sliceTime,
        }));
      await repo.updateFTTimeWindows(this, state.mFT.id, adaptedTimeWindows);
    },

    async deleteTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      if (!timeWindow?.id) return;
      await repo.deleteFTTimeWindow(this, state.mFT.id, timeWindow.id);
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
    isStatic: false,
    feedbacks: [],
    status: FTStatus.DRAFT,
    timeWindows: [],
    ftRefusals: [],
    ftValidations: [],
    isDeleted: false,
  };
}
