import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { FeedbackCreation, SavedFeedback } from "~/utils/models/feedback";
import {
    Ft,
    FtCreation,
    FtPageId,
    FtSearch,
    FtSimplified,
    FtTeamRequest,
    FtTeamRequestUpdate,
    FtTimeWindow,
    FtTimeWindowUpdate,
    FtUpdate,
    FtUserRequestUpdate,
} from "~/utils/models/ft";
import { FtTimeSpanParameters } from "~/utils/models/ftTimeSpan";
import {
    GearRequestCreation,
    GearRequestUpdate,
    GearRequestWithDrive,
    StoredGearRequest,
} from "~/utils/models/gearRequests";
import { Period } from "~/utils/models/period";
import { Reviewer } from "~/utils/models/review";
import { StatsPayload } from "~/utils/models/stats";
import { User } from "~/utils/models/user";
import { HttpStringified } from "~/utils/types/http";

const resource = "/ft";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFTs(context: Context, search?: FtSearch) {
    return context.$axios.get<HttpStringified<FtSimplified>[]>(resource, {
      params: search,
    });
  },
  getFT(context: Context, id: number) {
    return context.$axios.get<HttpStringified<Ft>>(`${resource}/${id}`);
  },
  createFT(context: Context, ft: FtCreation) {
    return context.$axios.post<HttpStringified<Ft>>(resource, ft);
  },
  getFtStats(context: Context) {
    return context.$axios.get<StatsPayload>(resource + "/stats");
  },
  updateFT(context: Context, ft: FtUpdate) {
    return context.$axios.patch<HttpStringified<Ft>>(
      `${resource}/${ft.id}`,
      ft
    );
  },
  deleteFT(context: Context, id: number) {
    return context.$axios.delete(`${resource}/${id}`);
  },

  submitFT(context: Context, ftId: number) {
    return context.$axios.patch<HttpStringified<Ft>>(
      `${resource}/${ftId}/submit`
    );
  },
  validateFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<Ft>>(
      `${resource}/${ftId}/validation`,
      reviewer
    );
  },
  refuseFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<Ft>>(
      `${resource}/${ftId}/refusal`,
      reviewer
    );
  },
  switchToReadyForAssignment(
    context: Context,
    ftId: number,
    timeSpanParameters: FtTimeSpanParameters
  ) {
    return context.$axios.post<HttpStringified<Ft>>(
      `${resource}/${ftId}/assignment-approval`,
      timeSpanParameters
    );
  },
  deleteFTReview(context: Context, ftId: number, teamCode: string) {
    return context.$axios.delete(`${resource}/${ftId}/reviews/${teamCode}`);
  },

  getPreviousFT(context: Context, id: number) {
    return context.$axios.get<FtPageId>(resource + `/${id}/previous`);
  },

  getNextFT(context: Context, id: number) {
    return context.$axios.get<FtPageId>(resource + `/${id}/next`);
  },

  updateFTTimeWindow(
    context: Context,
    ftId: number,
    timeWindow: FtTimeWindowUpdate
  ) {
    return context.$axios.post<HttpStringified<FtTimeWindow>>(
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
    userRequests: FtUserRequestUpdate[]
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
    teamRequests: FtTeamRequestUpdate[]
  ) {
    return context.$axios.post<HttpStringified<FtTeamRequest[]>>(
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

  removeGearRequestRentalPeriod(
    context: Context,
    taskId: number,
    removalPeriod: Period
  ) {
    return context.$axios.delete(`${resource}/${taskId}/gear-requests`, {
      data: removalPeriod,
    });
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
  getOrgaRequis(context: Context) {
    return context.$axios.get(resource + "/orga-requis");
  },
  myPlanning(context: Context, userId: string) {
    return context.$axios.get(`${resource}/orga-requis/${userId}`);
  },
};
