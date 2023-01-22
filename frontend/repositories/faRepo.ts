import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  CreateFA,
  FA,
  FaSitePublishAnimation,
  fa_collaborators,
  fa_comments,
  fa_electricity_needs,
  fa_general_update,
  fa_signa_needs,
  fa_validation_body,
  GearRequest,
  GearRequestCreation,
  GearRequestUpdate,
  GearRequestWithDrive,
  SearchFA,
  StoredGearRequest,
  time_windows,
} from "~/utils/models/FA";
import { StatsPayload } from "~/utils/models/stats";

const resource = "/fa";
type Context = { $axios: NuxtAxiosInstance };

function omitAuthors(comments: fa_comments[]): fa_comments[] {
  return comments.map(({ id, comment, author, subject, created_at }) => ({
    id,
    comment,
    author,
    subject,
    created_at,
  }));
}

export default {
  getAllFAs(context: Context, search?: SearchFA) {
    return context.$axios.get<FA[]>(resource, { params: search });
  },

  getFAById(context: Context, id: number) {
    return context.$axios.get<FA>(resource + `/${id}`);
  },

  createNewFA(context: Context, FA: CreateFA) {
    return context.$axios.post<FA>(resource, FA);
  },

  deleteFA(context: Context, id: number) {
    return context.$axios.delete<void>(`${resource}/${id}`);
  },

  getFaStats(context: Context) {
    return context.$axios.get<StatsPayload>(resource + "/stats");
  },

  updateFA(context: Context, id: number, FA: fa_general_update) {
    return context.$axios.post<FA>(resource + `/${id}`, FA);
  },

  updateFACollaborators(
    context: Context,
    id: number,
    collaborators: fa_collaborators[]
  ) {
    return context.$axios.post(`/collaborator/${id}`, collaborators);
  },

  deleteFACollaborators(context: Context, id: number) {
    return context.$axios.delete(`/collaborator/${id}`);
  },

  updateFASignaNeeds(
    context: Context,
    id: number,
    fa_signa_needs: fa_signa_needs[]
  ) {
    return context.$axios.post(`/fa-signa-needs/${id}`, fa_signa_needs);
  },

  deleteFASignaNeeds(context: Context, id: number) {
    return context.$axios.delete(`/fa-signa-needs/${id}`);
  },

  updateFATimeWindows(
    context: Context,
    id: number,
    time_windows: time_windows[]
  ) {
    return context.$axios.post(`/time-windows/${id}`, time_windows);
  },

  deleteFATimeWindows(context: Context, id: number) {
    return context.$axios.delete(`/time-windows/${id}`);
  },

  updateFAElectricityNeeds(
    context: Context,
    id: number,
    electricity_needs: fa_electricity_needs[]
  ) {
    return context.$axios.post(
      `/fa-electricity-needs/${id}`,
      electricity_needs
    );
  },

  deleteFAElectricityNeeds(context: Context, id: number) {
    return context.$axios.delete(`/fa-electricity-needs/${id}`);
  },

  updateFAComments(context: Context, id: number, comments: fa_comments[]) {
    const comments_update: fa_comments[] = omitAuthors(comments);
    return context.$axios.post<fa_comments[]>(
      `/fa-comment/${id}`,
      comments_update
    );
  },

  validateFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/${id}/validation`, body);
  },

  removeFaValidation(context: Context, faId: number, teamId: number) {
    return context.$axios.delete(resource + `/${faId}/validation/${teamId}`);
  },

  refuseFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/${id}/refusal`, body);
  },

  createGearRequest(
    context: Context,
    animationId: number,
    gearRequestCreationForm: GearRequestCreation
  ) {
    return context.$axios.post<StoredGearRequest>(
      resource + `/${animationId}/gear-requests`,
      gearRequestCreationForm
    );
  },

  getGearRequests(context: Context, animationId: number) {
    return context.$axios.get<StoredGearRequest[]>(
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
    return context.$axios.patch<GearRequest>(
      resource +
        `/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}`,
      gearRequestUpdateForm
    );
  },

  addPublishAnimation(
    context: Context,
    publishAnimation: FaSitePublishAnimation
  ) {
    return context.$axios.post<FaSitePublishAnimation>(
      `fa-site-publish-animation`,
      publishAnimation
    );
  },

  updatePublishAnimation(
    context: Context,
    id: number,
    publishAnimation: FaSitePublishAnimation
  ) {
    return context.$axios.put<FaSitePublishAnimation>(
      `fa-site-publish-animation/${id}`,
      publishAnimation
    );
  },

  deletePublishAnimation(context: Context, id: number) {
    return context.$axios.delete<void>(`fa-site-publish-animation/${id}`);
  },

  getAllPublishAnimation(context: Context) {
    return context.$axios.get<FaSitePublishAnimation[]>(
      `fa-site-publish-animation`
    );
  },

  validateGearRequest(
    context: Context,
    animationId: number,
    gearRequest: GearRequestWithDrive
  ) {
    const {
      gear: { id: gearId },
      rentalPeriod: { id: rentalPeriodId },
      drive,
    } = gearRequest;
    return context.$axios.patch<GearRequestWithDrive>(
      resource +
        `/${animationId}/gear-requests/${gearId}/rental-period/${rentalPeriodId}/approve`,
      { drive }
    );
  },
};
