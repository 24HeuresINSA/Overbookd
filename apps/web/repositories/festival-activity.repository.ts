import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  HttpStringified,
  InitInquiryRequest,
  PrepareInChargeForm,
  PrepareSignaForm,
  ReviewRejection,
} from "@overbookd/http";
import {
  Contractor,
  CreateFestivalActivityForm,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareFeedbackPublish,
  PrepareGeneralUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  Reviewer,
  Signage,
  TimeWindow,
} from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import { AddInquiryRequest } from "@overbookd/http";
import { LinkDrive } from "~/utils/festival-event/festival-activity.model";
import { StatsPayload } from "~/utils/models/stats.model";

type Context = { $axios: NuxtAxiosInstance };

export class FestivalActivityRepository {
  private static readonly basePath = "festival-activity";

  /* FETCH */
  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<PreviewFestivalActivity>[]>(
      this.basePath,
    );
  }

  static getOne(context: Context, id: FestivalActivity["id"]) {
    return context.$axios.get<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${id}`,
    );
  }

  static getStats(context: Context) {
    return context.$axios.get<HttpStringified<StatsPayload[]>>(
      `${this.basePath}/statistics`,
    );
  }

  /* CREATE */
  static create(context: Context, data: CreateFestivalActivityForm) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      this.basePath,
      data,
    );
  }

  /* ASK FOR REVIEW */
  static askForReview(context: Context, id: FestivalActivity["id"]) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${id}/ask-for-review`,
    );
  }

  /* UPDATE GENERAL */
  static updateGeneral(
    context: Context,
    faId: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/general`,
      general,
    );
  }

  static addGeneralTimeWindow(
    context: Context,
    faId: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/general/time-windows`,
      timeWindow,
    );
  }

  static removeGeneralTimeWindow(
    context: Context,
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/general/time-windows/${timeWindowId}`,
    );
  }

  /* UPDATE IN CHARGE */
  static updateInCharge(
    context: Context,
    faId: FestivalActivity["id"],
    inCharge: PrepareInChargeForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/in-charge`,
      inCharge,
    );
  }

  static addContractor(
    context: Context,
    faId: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/in-charge/contractors`,
      contractor,
    );
  }

  static updateContractor(
    context: Context,
    faId: FestivalActivity["id"],
    update: PrepareContractorUpdate,
  ) {
    const { id, ...contractor } = update;
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/in-charge/contractors/${id}`,
      contractor,
    );
  }

  static removeContractor(
    context: Context,
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/in-charge/contractors/${contractorId}`,
    );
  }

  /* UPDATE SIGNA */
  static updateSigna(
    context: Context,
    faId: FestivalActivity["id"],
    signa: PrepareSignaForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa`,
      signa,
    );
  }

  static addSignage(
    context: Context,
    faId: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa/signages`,
      signage,
    );
  }

  static updateSignage(
    context: Context,
    faId: FestivalActivity["id"],
    update: PrepareSignageUpdate,
  ) {
    const { id, ...signage } = update;
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa/signages/${id}`,
      signage,
    );
  }

  static removeSignage(
    context: Context,
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa/signages/${signageId}`,
    );
  }

  /* UPDATE SECURITY */
  static updateSecurity(
    context: Context,
    faId: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/security`,
      security,
    );
  }

  /* UPDATE SUPPLY */
  static updateSupply(
    context: Context,
    faId: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/supply`,
      supply,
    );
  }

  static addElectricitySupply(
    context: Context,
    faId: FestivalActivity["id"],
    supply: PrepareElectricitySupplyCreation,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/supply/electricity`,
      supply,
    );
  }

  static updateElectricitySupply(
    context: Context,
    faId: FestivalActivity["id"],
    update: PrepareElectricitySupplyUpdate,
  ) {
    const { id, ...supply } = update;
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/supply/electricity/${id}`,
      supply,
    );
  }

  static removeElectricitySupply(
    context: Context,
    faId: FestivalActivity["id"],
    supplyId: ElectricitySupply["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/supply/electricity/${supplyId}`,
    );
  }

  /* UPDATE INQUIRY */
  static addInquiryTimeWindow(
    context: Context,
    faId: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/inquiry/time-windows`,
      timeWindow,
    );
  }

  static removeInquiryTimeWindow(
    context: Context,
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/inquiry/time-windows/${timeWindowId}`,
    );
  }

  static addInquiryRequest(
    context: Context,
    faId: FestivalActivity["id"],
    request: AddInquiryRequest,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/inquiry/requests`,
      request,
    );
  }

  static removeInquiryRequest(
    context: Context,
    faId: FestivalActivity["id"],
    requestSlug: InquiryRequest["slug"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/inquiry/requests/${requestSlug}`,
    );
  }

  static initInquiry(
    context: Context,
    faId: FestivalActivity["id"],
    form: InitInquiryRequest,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/inquiry`,
      form,
    );
  }

  static linkDrive(
    context: Context,
    faId: FestivalActivity["id"],
    { slug, drive }: LinkDrive,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/inquiry/requests/${slug}`,
      { drive },
    );
  }

  /* PUBLISH FEEDBACK */
  static publishFeedback(
    context: Context,
    faId: number,
    feedback: PrepareFeedbackPublish,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/feedbacks`,
      feedback,
    );
  }

  static approve(
    context: Context,
    faId: FestivalActivity["id"],
    team: Reviewer,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/approve`,
      { team },
    );
  }

  static reject(
    context: Context,
    faId: FestivalActivity["id"],
    rejection: ReviewRejection,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/reject`,
      rejection,
    );
  }
}
