import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  CreateFA,
  FA,
  fa_collaborators,
  fa_comments,
  fa_comments_update,
  fa_electricity_needs,
  fa_general_update,
  fa_signa_needs,
  fa_validation_body,
  GearRequest,
  GearRequestCreation,
  GearRequestUpdate,
  SearchFA,
  time_windows,
} from "~/utils/models/FA";

const resource = "/fa";
type Context = { $axios: NuxtAxiosInstance };

function omitAuthors(comments: fa_comments[]): fa_comments_update[] {
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

  getFAByCount(context: Context, count: number) {
    return context.$axios.get<FA>(resource + `/${count}`);
  },

  createNewFA(context: Context, FA: CreateFA) {
    return context.$axios.post<FA>(resource, FA);
  },

  deleteFA(context: Context, id: number) {
    return context.$axios.delete<void>(`${resource}/${id}`);
  },

  getFAsNumber(context: Context) {
    return context.$axios.get<number>(resource + "/count");
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
    const comments_update: fa_comments_update[] = omitAuthors(comments);
    return context.$axios.post<fa_comments[]>(
      `/fa-comment/${id}`,
      comments_update
    );
  },

  validateFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/validate/${id}`, body);
  },

  invalidateFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/invalidate/${id}`, body);
  },

  refuseFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/refuse/${id}`, body);
  },

  createGearRequest(
    context: Context,
    animationId: number,
    gearRequestCreationForm: GearRequestCreation
  ) {
    return context.$axios.post<GearRequest>(
      resource + `/${animationId}/gear-requests`,
      gearRequestCreationForm
    );
  },

  getGearRequests(context: Context, animationId: number) {
    return context.$axios.get<GearRequest[]>(
      resource + `/${animationId}/gear-requests`
    );
  },

  deleteGearRequest(context: Context, animationId: number, gearId: number) {
    return context.$axios.delete(
      resource + `/${animationId}/gear-requests/${gearId}`
    );
  },

  updateGearRequest(
    context: Context,
    animationId: number,
    gearId: number,
    gearRequestUpdateForm: GearRequestUpdate
  ) {
    return context.$axios.patch<GearRequest>(
      resource + `/${animationId}/gear-requests/${gearId}`,
      gearRequestUpdateForm
    );
  },
};
