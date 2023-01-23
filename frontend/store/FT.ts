import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  FTCreation,
  FT,
  FTStatus,
  SearchFT,
  FTTimeWindow,
  FTTeamRequest,
  toUpdateFT,
  getTimeWindowWithoutRequests,
  castTimeWindowWithDate,
  castFTWithDate,
  FTSimplified,
} from "~/utils/models/ft";
import { Feedback } from "~/utils/models/feedback";
import { User } from "~/utils/models/user";
import { updateItemToList } from "~/utils/functions/list";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: defaultState() as FT,
  FTs: [] as FTSimplified[],
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

  SET_FTS(state, fts: FTSimplified[]) {
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
    if (index === -1) return;
    mFT.timeWindows = [
      ...mFT.timeWindows.slice(0, index),
      timeWindow,
      ...mFT.timeWindows.slice(index + 1),
    ];
  },

  DELETE_USER_REQUEST(
    { mFT },
    { timeWindow, userRequest }: { timeWindow: FTTimeWindow; userRequest: User }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    const userRequests = timeWindow.userRequests.filter(
      (ur) => ur.id !== userRequest.id
    );
    mFT.timeWindows = updateItemToList(mFT.timeWindows, index, {
      ...timeWindow,
      userRequests,
    });
  },

  DELETE_TEAM_REQUEST(
    { mFT },
    {
      timeWindow,
      teamRequest,
    }: { timeWindow: FTTimeWindow; teamRequest: FTTeamRequest }
  ) {
    const index = mFT.timeWindows.findIndex((tw) => tw.id === timeWindow.id);
    if (index === -1) return;
    const teamRequests = timeWindow.teamRequests.filter(
      (tr) => tr.team.id !== teamRequest.team.id
    );
    mFT.timeWindows = updateItemToList(mFT.timeWindows, index, {
      ...timeWindow,
      teamRequests,
    });
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
      commit("UPDATE_SELECTED_FT", castFTWithDate(res.data));
    },

    async fetchFTs({ commit }, search?: SearchFT) {
      console.log("store", search);
      const res = await safeCall(this, repo.getAllFTs(this, search), {
        errorMessage: "Impossible de charger les FTs",
      });
      if (!res) return;
      commit("SET_FTS", res.data);
    },

    async createFT({ commit, dispatch }, ft: FTCreation) {
      const res = await safeCall(this, repo.createFT(this, ft), {
        successMessage: "FT créée 🥳",
        errorMessage: "FT non créée 😢",
      });

      if (!res) return;
      const createdFT = castFTWithDate(res.data);
      commit("ADD_FT", createdFT);
      dispatch("setFT", { ...fakeFT(res.data.id), ...createdFT });
    },

    async updateFT({ commit }, ft: FT) {
      const ftToUpdate = toUpdateFT(ft);
      const res = await safeCall(this, repo.updateFT(this, ftToUpdate), {
        successMessage: "FT sauvegardée 🥳",
        errorMessage: "FT non sauvegardée 😢",
      });

      if (!res) return;
      const updatedFT = castFTWithDate(res.data);
      commit("UPDATE_SELECTED_FT", updatedFT);
    },

    async deleteFT({ commit }, ft: FT) {
      const res = await safeCall(this, repo.deleteFT(this, ft.id), {
        successMessage: "FT supprimée 🥳",
        errorMessage: "FT non supprimée 😢",
      });
      if (!res) return;
      commit("DELETE_FT", ft.id);
    },

    async restoreFT({ commit, dispatch }, ft: FT) {
      const restoredFT = { ...ft, isDeleted: false };
      dispatch("updateFT", restoredFT);
      commit("DELETE_FT", ft.id);
    },

    async addTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      const adaptedTimeWindow = getTimeWindowWithoutRequests(timeWindow);
      const res = await safeCall(
        this,
        repo.updateFTTimeWindow(this, state.mFT.id, adaptedTimeWindow),
        {
          successMessage: "Créneau ajouté 🥳",
          errorMessage: "Créneau non ajouté 😢",
        }
      );
      if (!res) return;
      commit("ADD_TIME_WINDOW", castTimeWindowWithDate(res.data));
    },

    async updateTimeWindow({ commit, state }, timeWindow: FTTimeWindow) {
      const adaptedTimeWindow = getTimeWindowWithoutRequests(timeWindow);
      const res = await safeCall(
        this,
        repo.updateFTTimeWindow(this, state.mFT.id, adaptedTimeWindow),
        {
          successMessage: "Créneau modifié 🥳",
          errorMessage: "Créneau non modifié 😢",
        }
      );
      if (!res) return;
      commit("UPDATE_TIME_WINDOW", castTimeWindowWithDate(res.data));
    },

    async updateTimeWindowRequirements({ commit }, timeWindow: FTTimeWindow) {
      commit("UPDATE_TIME_WINDOW", timeWindow);
      /*await Promise.all([
        safeCall(
          this,
          repo.updateUserRequests(this, state.mFT.id, timeWindow.userRequests)
        ),
        safeCall(
          this,
          repo.updateTeamRequests(this, state.mFT.id, timeWindow.teamRequests)
        ),
      ]);*/
    },

    async deleteUserRequest(
      { commit },
      {
        timeWindow,
        userRequest,
      }: { timeWindow: FTTimeWindow; userRequest: User }
    ) {
      commit("DELETE_USER_REQUEST", { timeWindow, userRequest });
      // request
    },

    async deleteTeamRequest(
      { commit },
      {
        timeWindow,
        teamRequest,
      }: { timeWindow: FTTimeWindow; teamRequest: FTTeamRequest }
    ) {
      commit("DELETE_TEAM_REQUEST", { timeWindow, teamRequest });
      // request
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
    reviews: [],
    isDeleted: false,
  };
}
