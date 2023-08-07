import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  Collaborator,
  CreateFa,
  Fa,
  FaElectricityNeed,
  FaGeneralUpdate,
  FaPageId,
  FaSignaNeed,
  FaSignaNeedsExportCsv,
  FaSimplified,
  FaTimeWindow,
  FaValidationBody,
  SearchFa,
  PublicAnimation,
  PublicAnimationCreation,
  PublicAnimationWithFa,
} from "~/utils/models/fa";
import { FeedbackCreation, SavedFeedback } from "~/utils/models/feedback";
import {
  GearRequest,
  GearRequestCreation,
  GearRequestUpdate,
  GearRequestWithDrive,
  StoredGearRequest,
} from "~/utils/models/gearRequests";
import { StatsPayload } from "~/utils/models/stats";
import { HttpStringified } from "~/utils/types/http";

const resource = "/fa";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFas(context: Context, search?: SearchFa) {
    return context.$axios.get<HttpStringified<FaSimplified>[]>(resource, {
      params: search,
    });
  },

  getFa(context: Context, id: number) {
    return context.$axios.get<HttpStringified<Fa>>(resource + `/${id}`);
  },

  createFa(context: Context, FA: CreateFa) {
    return context.$axios.post<HttpStringified<Fa>>(resource, FA);
  },

  deleteFa(context: Context, id: number) {
    return context.$axios.delete<void>(`${resource}/${id}`);
  },

  getFaStats(context: Context) {
    return context.$axios.get<StatsPayload>(resource + "/stats");
  },

  updateFa(context: Context, fa: FaGeneralUpdate) {
    return context.$axios.post<HttpStringified<Fa>>(`${resource}/${fa.id}`, fa);
  },

  updateCollaborator(
    context: Context,
    faId: number,
    collaborator: Collaborator
  ) {
    return context.$axios.post(
      `${resource}/${faId}/collaborator`,
      collaborator
    );
  },

  deleteCollaborator(context: Context, faId: number) {
    return context.$axios.delete(`${resource}/${faId}/collaborator`);
  },

  updateFASignaNeeds(context: Context, id: number, signaNeeds: FaSignaNeed[]) {
    return context.$axios.post(`/fa-signa-needs/${id}`, signaNeeds);
  },

  deleteFASignaNeeds(context: Context, id: number) {
    return context.$axios.delete(`/fa-signa-needs/${id}`);
  },

  updateAnimationTimeWindow(
    context: Context,
    faId: number,
    timeWindow: FaTimeWindow
  ) {
    return context.$axios.post<HttpStringified<FaTimeWindow>>(
      `${resource}/${faId}/time-windows`,
      timeWindow
    );
  },

  deleteAnimationTimeWindow(context: Context, faId: number, twId: number) {
    return context.$axios.delete(`${resource}/${faId}/time-windows/${twId}`);
  },

  updateFAElectricityNeeds(
    context: Context,
    id: number,
    electricityNeeds: FaElectricityNeed[]
  ) {
    return context.$axios.post(`/fa-electricity-needs/${id}`, electricityNeeds);
  },

  deleteFAElectricityNeeds(context: Context, id: number) {
    return context.$axios.delete(`/fa-electricity-needs/${id}`);
  },

  addFAFeedback(context: Context, faId: number, feedback: FeedbackCreation) {
    return context.$axios.post<HttpStringified<SavedFeedback>>(
      `${resource}/${faId}/feedback`,
      feedback
    );
  },

  validateFA(context: Context, id: number, body: FaValidationBody) {
    return context.$axios.post(resource + `/${id}/validation`, body);
  },

  removeFaValidation(context: Context, faId: number, teamId: number) {
    return context.$axios.delete(resource + `/${faId}/validation/${teamId}`);
  },

  refuseFA(context: Context, id: number, body: FaValidationBody) {
    return context.$axios.post(resource + `/${id}/refusal`, body);
  },

  getPreviousFa(context: Context, id: number) {
    return context.$axios.get<FaPageId>(resource + `/${id}/previous`);
  },

  getNextFa(context: Context, id: number) {
    return context.$axios.get<FaPageId>(resource + `/${id}/next`);
  },

  createGearRequest(
    context: Context,
    animationId: number,
    gearRequestCreationForm: GearRequestCreation
  ) {
    return context.$axios.post<HttpStringified<StoredGearRequest<"FA">>>(
      resource + `/${animationId}/gear-requests`,
      gearRequestCreationForm
    );
  },

  getGearRequests(context: Context, animationId: number) {
    return context.$axios.get<HttpStringified<StoredGearRequest<"FA">>[]>(
      resource + `/${animationId}/gear-requests`
    );
  },

  deleteGearRequest(
    context: Context,
    animationId: number,
    gearId: number,
    rentalPeriodId: number
  ) {
    return context.$axios.delete(
      resource +
        `/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`
    );
  },

  updateGearRequest(
    context: Context,
    animationId: number,
    gearId: number,
    rentalPeriodId: number,
    gearRequestUpdateForm: GearRequestUpdate
  ) {
    return context.$axios.patch<GearRequest<"FA">>(
      resource +
        `/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`,
      gearRequestUpdateForm
    );
  },

  addPublicAnimation(
    context: Context,
    publicAnimation: PublicAnimationCreation
  ) {
    return context.$axios.post<HttpStringified<PublicAnimation>>(
      `public-animation`,
      publicAnimation
    );
  },

  updatePublicAnimation(
    context: Context,
    id: number,
    publicAnimation: PublicAnimation
  ) {
    return context.$axios.put<HttpStringified<PublicAnimation>>(
      `public-animation/${id}`,
      publicAnimation
    );
  },

  deletePublicAnimation(context: Context, id: number) {
    return context.$axios.delete<void>(`public-animation/${id}`);
  },

  getAllPublicAnimations(context: Context) {
    return context.$axios.get<HttpStringified<PublicAnimationWithFa[]>>(
      `public-animation`
    );
  },

  validateGearRequest(
    context: Context,
    animationId: number,
    gearRequest: GearRequestWithDrive<"FA" | "FT">
  ) {
    const {
      gear: { id: gearId },
      rentalPeriod: { id: rentalPeriodId },
      drive,
    } = gearRequest;
    return context.$axios.patch<GearRequestWithDrive<"FA">>(
      resource +
        `/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}/approve`,
      { drive }
    );
  },

  exportSignaNeedsForCsv(context: Context) {
    return context.$axios.get<FaSignaNeedsExportCsv[]>(
      `/fa-signa-needs/export-csv`
    );
  },
};
