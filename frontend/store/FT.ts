import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  FTCreation,
  FT,
  FTStatus,
  FTSearch,
  FTTimeWindow,
  FTTeamRequest,
  toUpdateFT,
  getTimeWindowWithoutRequests,
  castTimeWindowWithDate,
  castFTWithDate,
  FTSimplified,
} from "~/utils/models/ft";
import {
  Feedback,
  FeedbackCreation,
  SubjectType,
} from "~/utils/models/feedback";
import { User } from "~/utils/models/user";
import { updateItemToList } from "~/utils/functions/list";
import { Team } from "~/utils/models/team";
import { formatUsername } from "~/utils/user/userUtils";
import { Review, ReviewBody, ReviewStatus } from "~/utils/models/review";

const repo = RepoFactory.ftRepo;

export const state = () => ({
  mFT: defaultState() as FT,
  FTs: [] as FTSimplified[],
});

export const getters = getterTree(state, {
  validationReviews(state): Review[] {
    return state.mFT.reviews.filter((r) => r.status === ReviewStatus.VALIDATED);
  },
  refusalReviews(state): Review[] {
    return state.mFT.reviews.filter((r) => r.status === ReviewStatus.REFUSED);
  },
});

export const mutations = mutationTree(state, {
  UPDATE_SELECTED_FT(state, ft: Partial<FT>) {
    state.mFT = { ...state.mFT, ...ft };
  },

  RESET_FT(state) {
    state.mFT = defaultState() as FT;
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

  UPDATE_STATUS({ mFT }, status: FTStatus) {
    mFT.status = status;
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

    async fetchFT({ commit, dispatch }, id: number) {
      const resFT = await safeCall(this, repo.getFT(this, id));
      if (!resFT) return null;
      commit("UPDATE_SELECTED_FT", castFTWithDate(resFT.data));
      if (resFT.data.fa)
        dispatch("FA/fetchGearRequests", resFT.data.fa.id, { root: true });
    },

    async fetchFTs({ commit }, search?: FTSearch) {
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

    async submitForReview({ dispatch, state }, author: User) {
      const authorName = formatUsername(author);
      const feedback: Feedback = {
        subject: SubjectType.SUBMIT,
        comment: `La FT a été soumise à validation par ${authorName}.`,
        author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", { ...feedback, author });
      dispatch("updateFT", { ...state.mFT, status: FTStatus.SUBMITTED });
    },

    async validate(
      { dispatch, commit, state, getters, rootState },
      { validator, team, author }: { validator: User; team: Team; author: User }
    ) {
      //check if the team is already in the list
      if (
        getters.validationReviews.find(
          (r: Review) => r.team.id === validator.id
        )
      ) {
        return;
      }
      if (getters.refusalReviews.length === 1) {
        if (getters.refusalReviews[0].team.id === validator.id) {
          commit("UPDATE_STATUS", FTStatus.SUBMITTED);
        }
      }
      const MAX_VALIDATORS = rootState.team.ftValidators.length;
      // -1 car la validation est faite avant l'ajout du validateur
      if (getters.validationReviews.length === MAX_VALIDATORS - 1) {
        commit("UPDATE_STATUS", FTStatus.VALIDATED);
      }

      const ftToUpdate = toUpdateFT(state.mFT);
      const res = await safeCall(this, repo.updateFT(this, ftToUpdate));
      if (!res) return;

      const body: ReviewBody = { userId: author.id };
      await repo.validateFT(this, state.mFT.id, validator.id, body);

      const feedback: Feedback = {
        subject: SubjectType.VALIDATED,
        comment: `La FT a été validée par ${team.name}.`,
        author: author,
        createdAt: new Date(),
      };
      dispatch("addFeedback", { ...feedback, author });
    },

    async refuse({ dispatch, state }, { validator, message, author }) {
      dispatch("updateFT", { ...state.mFT, status: FTStatus.REFUSED });

      const body: ReviewBody = { userId: author.id };
      await repo.refuseFT(this, state.mFT.id, validator.id, body);

      const feedback: Feedback = {
        subject: SubjectType.REFUSED,
        comment: `La FA a été refusée${message ? ": " + message : "."}`,
        author: author.id,
        createdAt: new Date(),
      };
      dispatch("addFeedback", { ...feedback, author });
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
      const res = await safeCall(
        this,
        repo.deleteFTTimeWindow(this, state.mFT.id, timeWindow.id)
      );
      if (!res) return;
      commit("DELETE_TIME_WINDOW", timeWindow);
    },

    async addFeedback({ commit, state }, feedback: Feedback) {
      const feedbackCreation: FeedbackCreation = {
        ...feedback,
        author: feedback.author.id,
      };
      await repo.addFTFeedback(this, state.mFT.id, feedbackCreation);
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
