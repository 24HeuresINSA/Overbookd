import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  CreateFa,
  Fa,
  FaCollaborator,
  FaElectricityNeed,
  FaFeedback,
  FaGeneralUpdate,
  FaPageId,
  FaSignaNeed,
  FaSignaNeedsExportCsv,
  FaTimeWindow,
  FaValidationBody,
  SearchFa,
  SitePublishAnimation,
  SitePublishAnimationCreation,
  SitePublishAnimationWithFa,
} from "~/utils/models/FA";
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

function omitAuthors(comments: FaFeedback[]): FaFeedback[] {
  return comments.map(({ id, comment, authorId, subject, createdAt }) => ({
    id,
    comment,
    authorId,
    subject,
    createdAt,
  }));
}

export default {
  getAllFAs(context: Context, search?: SearchFa) {
    return context.$axios.get<HttpStringified<Fa>[]>(resource, {
      params: search,
    });
  },

  getFAById(context: Context, id: number) {
    return context.$axios.get<HttpStringified<Fa>>(resource + `/${id}`);
  },

  createNewFA(context: Context, FA: CreateFa) {
    return context.$axios.post<HttpStringified<Fa>>(resource, FA);
  },

  deleteFA(context: Context, id: number) {
    return context.$axios.delete<void>(`${resource}/${id}`);
  },

  getFaStats(context: Context) {
    return context.$axios.get<StatsPayload>(resource + "/stats");
  },

  updateFA(context: Context, id: number, FA: FaGeneralUpdate) {
    return context.$axios.post<HttpStringified<Fa>>(resource + `/${id}`, FA);
  },

  updateFACollaborators(
    context: Context,
    id: number,
    collaborators: FaCollaborator[]
  ) {
    return context.$axios.post(`/collaborator/${id}`, collaborators);
  },

  deleteFACollaborators(context: Context, id: number) {
    return context.$axios.delete(`/collaborator/${id}`);
  },

  updateFASignaNeeds(
    context: Context,
    id: number,
    fa_signa_needs: FaSignaNeed[]
  ) {
    return context.$axios.post(`/fa-signa-needs/${id}`, fa_signa_needs);
  },

  deleteFASignaNeeds(context: Context, id: number) {
    return context.$axios.delete(`/fa-signa-needs/${id}`);
  },

  updateFATimeWindows(
    context: Context,
    id: number,
    time_windows: FaTimeWindow[]
  ) {
    return context.$axios.post<HttpStringified<FaTimeWindow>[]>(
      `/time-windows/${id}`,
      time_windows
    );
  },

  deleteFATimeWindows(context: Context, id: number) {
    return context.$axios.delete(`/time-windows/${id}`);
  },

  updateFAElectricityNeeds(
    context: Context,
    id: number,
    electricity_needs: FaElectricityNeed[]
  ) {
    return context.$axios.post(
      `/fa-electricity-needs/${id}`,
      electricity_needs
    );
  },

  deleteFAElectricityNeeds(context: Context, id: number) {
    return context.$axios.delete(`/fa-electricity-needs/${id}`);
  },

  updateFAComments(context: Context, id: number, comments: FaFeedback[]) {
    const comments_update: FaFeedback[] = omitAuthors(comments);
    return context.$axios.post<FaFeedback[]>(
      `/fa-comment/${id}`,
      comments_update
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

  addPublishAnimation(
    context: Context,
    publishAnimation: SitePublishAnimationCreation
  ) {
    return context.$axios.post<SitePublishAnimation>(
      `fa-site-publish-animation`,
      publishAnimation
    );
  },

  updatePublishAnimation(
    context: Context,
    id: number,
    publishAnimation: SitePublishAnimation
  ) {
    return context.$axios.put<SitePublishAnimation>(
      `fa-site-publish-animation/${id}`,
      publishAnimation
    );
  },

  deletePublishAnimation(context: Context, id: number) {
    return context.$axios.delete<void>(`fa-site-publish-animation/${id}`);
  },

  getAllPublishAnimation(context: Context) {
    return context.$axios.get<SitePublishAnimationWithFa[]>(
      `fa-site-publish-animation`
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
