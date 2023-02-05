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
import {
  GearRequestCreation,
  GearRequestUpdate,
  GearRequestWithDrive,
  StoredGearRequest,
} from "~/utils/models/gearRequests";
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

  submitFT(context: Context, ftId: number) {
    return context.$axios.patch<HttpStringified<FT>>(
      `${resource}/${ftId}/submit`
    );
  },
  validateFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<FT>>(
      `${resource}/${ftId}/validation`,
      reviewer
    );
  },
  refuseFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<FT>>(
      `${resource}/${ftId}/refusal`,
      reviewer
    );
  },
  deleteFTReview(context: Context, ftId: number, teamCode: string) {
    return context.$axios.delete(`${resource}/${ftId}/reviews/${teamCode}`);
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
  deleteFTUserRequest(
    context: Context,
    ftId: number,
    twId: number,
    userId: number
  ) {
    return context.$axios.delete(
      `${resource}/${ftId}/time-windows/${twId}/user-requests/${userId}`
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
  deleteFTTeamRequest(
    context: Context,
    ftId: number,
    twId: number,
    teamCode: string
  ) {
    return context.$axios.delete(
      `${resource}/${ftId}/time-windows/${twId}/team-requests/${teamCode}`
    );
  },

  addFTFeedback(context: Context, ftId: number, feedback: FeedbackCreation) {
    return context.$axios.post<HttpStringified<SavedFeedback>>(
      `${resource}/${ftId}/feedback`,
      feedback
    );
  },

  createGearRequest(
    context: Context,
    taskId: number,
    gearRequestCreationForm: GearRequestCreation
  ) {
    return context.$axios.post<HttpStringified<StoredGearRequest<"FT">>>(
      `${resource}/${taskId}/gear-requests`,
      gearRequestCreationForm
    );
  },

  getGearRequests(context: Context, taskId: number) {
    return context.$axios.get<HttpStringified<StoredGearRequest<"FT">>[]>(
      `${resource}/${taskId}/gear-requests`
    );
  },

  deleteGearRequest(
    context: Context,
    taskId: number,
    gearId: number,
    rentalPeriodId: number
  ) {
    return context.$axios.delete(
      `${resource}/${taskId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`
    );
  },

  updateGearRequest(
    context: Context,
    taskId: number,
    gearId: number,
    rentalPeriodId: number,
    gearRequestUpdateForm: GearRequestUpdate
  ) {
    return context.$axios.patch<HttpStringified<StoredGearRequest<"FT">>>(
      `${resource}/${taskId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`,
      gearRequestUpdateForm
    );
  },

  validateGearRequest(
    context: Context,
    taskId: number,
    gearRequest: GearRequestWithDrive<"FA" | "FT">
  ) {
    const {
      gear: { id: gearId },
      rentalPeriod: { id: rentalPeriodId },
      drive,
    } = gearRequest;
    return context.$axios.patch<GearRequestWithDrive<"FT">>(
      `${resource}/${taskId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}/approve`,
      { drive }
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
