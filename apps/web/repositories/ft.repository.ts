import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { IProvidePeriod } from "@overbookd/period";
import { FeedbackCreation, SavedFeedback } from "~/utils/models/feedback.model";
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
} from "~/utils/models/ft.model";
import { FtTimeSpanParameters } from "~/utils/models/ft-time-span.model";
import {
  GearRequestCreation,
  GearRequestUpdate,
  GearRequestWithDrive,
  StoredGearRequest,
} from "~/utils/models/gear-request.model";
import { Reviewer } from "~/utils/models/review.model";
import { User } from "@overbookd/user";
import { HttpStringified } from "@overbookd/http";

type Context = { $axios: NuxtAxiosInstance };

export class FtRepository {
  private static readonly basePath = "ft";

  static getAllFTs(context: Context, search?: FtSearch) {
    return context.$axios.get<HttpStringified<FtSimplified>[]>(this.basePath, {
      params: search,
    });
  }

  static getFT(context: Context, id: number) {
    return context.$axios.get<HttpStringified<Ft>>(`${this.basePath}/${id}`);
  }

  static createFT(context: Context, ft: FtCreation) {
    return context.$axios.post<HttpStringified<Ft>>(this.basePath, ft);
  }

  static updateFT(context: Context, ft: FtUpdate) {
    return context.$axios.patch<HttpStringified<Ft>>(
      `${this.basePath}/${ft.id}`,
      ft,
    );
  }

  static deleteFT(context: Context, id: number) {
    return context.$axios.delete(`${this.basePath}/${id}`);
  }

  static submitFT(context: Context, ftId: number) {
    return context.$axios.patch<HttpStringified<Ft>>(
      `${this.basePath}/${ftId}/submit`,
    );
  }

  static validateFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<Ft>>(
      `${this.basePath}/${ftId}/validation`,
      reviewer,
    );
  }

  static refuseFT(context: Context, ftId: number, reviewer: Reviewer) {
    return context.$axios.post<HttpStringified<Ft>>(
      `${this.basePath}/${ftId}/refusal`,
      reviewer,
    );
  }

  static switchToReadyForAssignment(
    context: Context,
    ftId: number,
    timeSpanParameters: FtTimeSpanParameters,
  ) {
    return context.$axios.post<HttpStringified<Ft>>(
      `${this.basePath}/${ftId}/assignment-approval`,
      timeSpanParameters,
    );
  }

  static deleteFTReview(context: Context, ftId: number, teamCode: string) {
    return context.$axios.delete(
      `${this.basePath}/${ftId}/reviews/${teamCode}`,
    );
  }

  static getPreviousFT(context: Context, id: number) {
    return context.$axios.get<FtPageId>(`${this.basePath}/${id}/previous`);
  }

  static getNextFT(context: Context, id: number) {
    return context.$axios.get<FtPageId>(`${this.basePath}/${id}/next`);
  }

  static updateFTTimeWindow(
    context: Context,
    ftId: number,
    timeWindow: FtTimeWindowUpdate,
  ) {
    return context.$axios.post<HttpStringified<FtTimeWindow>>(
      `${this.basePath}/${ftId}/time-windows`,
      timeWindow,
    );
  }

  static deleteFTTimeWindow(context: Context, ftId: number, twId: number) {
    return context.$axios.delete(
      `${this.basePath}/${ftId}/time-windows/${twId}`,
    );
  }

  static updateFTUserRequests(
    context: Context,
    ftId: number,
    twId: number,
    userRequests: FtUserRequestUpdate[],
  ) {
    return context.$axios.post<HttpStringified<User[]>>(
      `${this.basePath}/${ftId}/time-windows/${twId}/user-requests`,
      userRequests,
    );
  }

  static deleteFTUserRequest(
    context: Context,
    ftId: number,
    twId: number,
    userId: number,
  ) {
    return context.$axios.delete(
      `${this.basePath}/${ftId}/time-windows/${twId}/user-requests/${userId}`,
    );
  }

  static updateFTTeamRequests(
    context: Context,
    ftId: number,
    twId: number,
    teamRequests: FtTeamRequestUpdate[],
  ) {
    return context.$axios.post<HttpStringified<FtTeamRequest[]>>(
      `${this.basePath}/${ftId}/time-windows/${twId}/team-requests`,
      teamRequests,
    );
  }

  static deleteFTTeamRequest(
    context: Context,
    ftId: number,
    twId: number,
    teamCode: string,
  ) {
    return context.$axios.delete(
      `${this.basePath}/${ftId}/time-windows/${twId}/team-requests/${teamCode}`,
    );
  }

  static addFTFeedback(
    context: Context,
    ftId: number,
    feedback: FeedbackCreation,
  ) {
    return context.$axios.post<HttpStringified<SavedFeedback>>(
      `${this.basePath}/${ftId}/feedback`,
      feedback,
    );
  }

  static createGearRequest(
    context: Context,
    taskId: number,
    gearRequestCreationForm: GearRequestCreation,
  ) {
    return context.$axios.post<HttpStringified<StoredGearRequest<"FT">>>(
      `${this.basePath}/${taskId}/gear-requests`,
      gearRequestCreationForm,
    );
  }

  static getGearRequests(context: Context, taskId: number) {
    return context.$axios.get<HttpStringified<StoredGearRequest<"FT">>[]>(
      `${this.basePath}/${taskId}/gear-requests`,
    );
  }

  static deleteGearRequest(
    context: Context,
    taskId: number,
    gearId: number,
    rentalPeriodId: number,
  ) {
    return context.$axios.delete(
      `${this.basePath}/${taskId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`,
    );
  }

  static removeGearRequestRentalPeriod(
    context: Context,
    taskId: number,
    removalPeriod: IProvidePeriod,
  ) {
    return context.$axios.delete(`${this.basePath}/${taskId}/gear-requests`, {
      data: removalPeriod,
    });
  }

  static updateGearRequest(
    context: Context,
    taskId: number,
    gearId: number,
    rentalPeriodId: number,
    gearRequestUpdateForm: GearRequestUpdate,
  ) {
    return context.$axios.patch<HttpStringified<StoredGearRequest<"FT">>>(
      `${this.basePath}/${taskId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`,
      gearRequestUpdateForm,
    );
  }

  static validateGearRequest(
    context: Context,
    taskId: number,
    gearRequest: GearRequestWithDrive<"FA" | "FT">,
  ) {
    const {
      gear: { id: gearId },
      rentalPeriod: { id: rentalPeriodId },
      drive,
    } = gearRequest;
    return context.$axios.patch<GearRequestWithDrive<"FT">>(
      `${this.basePath}/${taskId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}/approve`,
      { drive },
    );
  }
}
