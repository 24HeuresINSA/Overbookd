import {
  CSV,
  type InitInquiryRequest,
  type LinkSignageCatalogItemForm,
  type PrepareInChargeForm,
  type PrepareSignaForm,
  type PreviewForCommunication,
  type PreviewForSecurity,
  type ReviewRejection,
} from "@overbookd/http";
import type {
  AssignDrive,
  Contractor,
  CreateFestivalActivityForm,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareGeneralUpdate,
  PrepareSecurityUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  Signage,
  TimeWindow,
} from "@overbookd/festival-event";
import type { IProvidePeriod } from "@overbookd/time";
import type {
  AddInquiryRequestForm,
  UpdateInquiryRequestForm,
  PublishFeedbackForm,
  ReviewApproval,
  Statistics,
} from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class FestivalActivityRepository {
  private static readonly basePath = "festival-activities";

  /* FETCH */
  static getAll() {
    return HttpClient.get<PreviewFestivalActivity[]>(this.basePath);
  }

  static getMine() {
    return HttpClient.get<PreviewFestivalActivity[]>(`${this.basePath}/mine`);
  }

  static getSecurityPreviews() {
    return HttpClient.get<PreviewForSecurity[]>(
      `${this.basePath}/for-security`,
    );
  }

  static getCommunicationPreviews() {
    return HttpClient.get<PreviewForCommunication[]>(
      `${this.basePath}/for-communication`,
    );
  }

  static getCSVLogisticPreviews() {
    return HttpClient.get<string>(`${this.basePath}/for-logistic`, {
      acceptedType: CSV,
    });
  }

  static getOne(id: FestivalActivity["id"]) {
    return HttpClient.get<FestivalActivity>(`${this.basePath}/${id}`);
  }

  static getStats() {
    return HttpClient.get<Statistics<FestivalActivity>[]>(
      `${this.basePath}/statistics`,
    );
  }

  static getMyRefusalsCount() {
    return HttpClient.get<number>(`${this.basePath}/my-refusals/count`);
  }

  /* CREATE */
  static create(data: CreateFestivalActivityForm) {
    return HttpClient.post<FestivalActivity>(this.basePath, data);
  }

  /* ASK FOR REVIEW */
  static askForReview(id: FestivalActivity["id"]) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${id}/ask-for-review`,
    );
  }

  /* REMOVE */
  static remove(id: FestivalActivity["id"]) {
    return HttpClient.delete<void>(`${this.basePath}/${id}`);
  }

  /* UPDATE GENERAL */
  static updateGeneral(
    faId: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/general`,
      general,
    );
  }

  static addGeneralTimeWindow(
    faId: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/general/time-windows`,
      timeWindow,
    );
  }

  static removeGeneralTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/general/time-windows/${timeWindowId}`,
    );
  }

  /* UPDATE IN CHARGE */
  static updateInCharge(
    faId: FestivalActivity["id"],
    inCharge: PrepareInChargeForm,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/in-charge`,
      inCharge,
    );
  }

  static addContractor(
    faId: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/in-charge/contractors`,
      contractor,
    );
  }

  static updateContractor(
    faId: FestivalActivity["id"],
    update: PrepareContractorUpdate,
  ) {
    const { id, ...contractor } = update;
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/in-charge/contractors/${id}`,
      contractor,
    );
  }

  static removeContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/in-charge/contractors/${contractorId}`,
    );
  }

  /* UPDATE SIGNA */
  static updateSigna(faId: FestivalActivity["id"], signa: PrepareSignaForm) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/signa`,
      signa,
    );
  }

  static addSignage(
    faId: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/signa/signages`,
      signage,
    );
  }

  static updateSignage(
    faId: FestivalActivity["id"],
    update: PrepareSignageUpdate,
  ) {
    const { id, ...signage } = update;
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/signa/signages/${id}`,
      signage,
    );
  }

  static removeSignage(faId: FestivalActivity["id"], signageId: Signage["id"]) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/signa/signages/${signageId}`,
    );
  }

  static linkSignageCatalogItem(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
    catalogItem: LinkSignageCatalogItemForm,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/signa/signages/${signageId}/link`,
      catalogItem,
    );
  }

  /* UPDATE SECURITY */
  static updateSecurity(
    faId: FestivalActivity["id"],
    security: PrepareSecurityUpdate,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/security`,
      security,
    );
  }

  /* UPDATE SUPPLY */
  static updateSupply(
    faId: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/supply`,
      supply,
    );
  }

  static addElectricitySupply(
    faId: FestivalActivity["id"],
    supply: PrepareElectricitySupplyCreation,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/supply/electricity`,
      supply,
    );
  }

  static updateElectricitySupply(
    faId: FestivalActivity["id"],
    update: PrepareElectricitySupplyUpdate,
  ) {
    const { id, ...supply } = update;
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/supply/electricity/${id}`,
      supply,
    );
  }

  static removeElectricitySupply(
    faId: FestivalActivity["id"],
    supplyId: ElectricitySupply["id"],
  ) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/supply/electricity/${supplyId}`,
    );
  }

  /* UPDATE INQUIRY */
  static addInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/time-windows`,
      timeWindow,
    );
  }

  static updateInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
    period: IProvidePeriod,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/time-windows/${timeWindowId}`,
      period,
    );
  }

  static removeInquiryTimeWindow(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/time-windows/${timeWindowId}`,
    );
  }

  static addInquiryRequest(
    faId: FestivalActivity["id"],
    request: AddInquiryRequestForm,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/requests`,
      request,
    );
  }

  static updateInquiryRequest(
    faId: FestivalActivity["id"],
    slug: InquiryRequest["slug"],
    request: UpdateInquiryRequestForm,
  ) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/requests/${slug}`,
      request,
    );
  }

  static removeInquiryRequest(
    faId: FestivalActivity["id"],
    requestSlug: InquiryRequest["slug"],
  ) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/requests/${requestSlug}`,
    );
  }

  static initInquiry(faId: FestivalActivity["id"], form: InitInquiryRequest) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry`,
      form,
    );
  }

  static clearInquiry(faId: FestivalActivity["id"]) {
    return HttpClient.delete<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry`,
    );
  }

  static linkDrive(faId: FestivalActivity["id"], { slug, drive }: AssignDrive) {
    return HttpClient.patch<FestivalActivity>(
      `${this.basePath}/${faId}/inquiry/requests/${slug}/link-drive`,
      { drive },
    );
  }

  /* PUBLISH FEEDBACK */
  static publishFeedback(
    faId: FestivalActivity["id"],
    feedback: PublishFeedbackForm,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/feedbacks`,
      feedback,
    );
  }

  static approve(faId: FestivalActivity["id"], approval: ReviewApproval<"FA">) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/approve`,
      approval,
    );
  }

  static reject(
    faId: FestivalActivity["id"],
    rejection: ReviewRejection<"FA">,
  ) {
    return HttpClient.post<FestivalActivity>(
      `${this.basePath}/${faId}/reject`,
      rejection,
    );
  }
}
