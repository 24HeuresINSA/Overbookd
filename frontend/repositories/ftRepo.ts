import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  Feedback,
  FeedbackCreation,
  SavedFeedback,
} from "~/utils/models/feedback";
import {
  FTCreation,
  FTSearch,
  FTUpdate,
  FTTimeWindowUpdate,
  FTTimeWindow,
  FTSimplified,
  FT,
  FTTeamRequestUpdate,
  FTUserRequestUpdate,
  FTTeamRequest,
} from "~/utils/models/ft";
import { Reviewer } from "~/utils/models/review";
import { User } from "~/utils/models/user";
import { HttpStringified } from "~/utils/types/http";

const resource = "/ft";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFTs(context: Context, search?: FTSearch) {
    return context.$axios.get<HttpStringified<FTSimplified>[]>(resource, {
      params: search,
    });
  },
  getFT(context: Context, id: number) {
    return context.$axios.get<HttpStringified<FT>>(`${resource}/${id}`);
  },
  createFT(context: Context, ft: FTCreation) {
    return context.$axios.post<HttpStringified<FT>>(resource, ft);
  },
  updateFT(context: Context, ft: FTUpdate) {
    return context.$axios.patch<HttpStringified<FT>>(
      `${resource}/${ft.id}`,
      ft
    );
  },
  deleteFT(context: Context, id: number) {
    return context.$axios.delete(`${resource}/${id}`);
  },

  validateFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<FT>>(
      `${resource}/${ftId}/validate`,
      reviewer
    );
  },
  refuseFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<FT>>(
      `${resource}/${ftId}/refuse`,
      reviewer
    );
  },

  updateFTTimeWindow(
    context: Context,
    ftId: number,
    timeWindow: FTTimeWindowUpdate
  ) {
    return context.$axios.post<HttpStringified<FTTimeWindow>>(
      `${resource}/${ftId}/time-windows`,
      timeWindow
    );
  },
  deleteFTTimeWindow(context: Context, ftId: number, twId: number) {
    return context.$axios.delete(`${resource}/${ftId}/time-windows/${twId}`);
  },
  updateFTUserRequests(
    context: Context,
    ftId: number,
    twId: number,
    userRequests: FTUserRequestUpdate[]
  ) {
    return context.$axios.post<HttpStringified<User[]>>(
      `${resource}/${ftId}/time-windows/${twId}/user-requests`,
      userRequests
    );
  },

  updateFTTeamRequests(
    context: Context,
    ftId: number,
    twId: number,
    teamRequests: FTTeamRequestUpdate[]
  ) {
    return context.$axios.post<HttpStringified<FTTeamRequest[]>>(
      `${resource}/${ftId}/time-windows/${twId}/team-requests`,
      teamRequests
    );
  },

  addFTFeedback(context: Context, ftId: number, feedback: FeedbackCreation) {
    return context.$axios.post<HttpStringified<SavedFeedback>>(
      `${resource}/${ftId}/feedbacks`,
      feedback
    );
  },

  // old requests
  markAsReady(context: Context, FTCount: number, comment: Feedback) {
    return context.$axios.post(`${resource}/${FTCount}/ready`, { comment });
  },
  getFTsNumber(context: Context) {
    return context.$axios.get(resource + "/count");
  },
  getOrgaRequis(context: Context) {
    return context.$axios.get(resource + "/orga-requis");
  },
  myPlanning(context: Context, userId: string) {
    return context.$axios.get(`${resource}/orga-requis/${userId}`);
  },
};
