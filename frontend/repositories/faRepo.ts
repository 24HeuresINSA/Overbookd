import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  FA,
  fa_general_update,
  fa_collaborators,
  fa_signa_needs,
  time_windows,
  fa_electricity_needs,
  fa_comments,
  fa_validation_body,
  fa_comments_update,
} from "~/utils/models/FA";

const resource = "/fa";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFAs(context: Context) {
    return context.$axios.get(resource);
  },
  getFAByCount(context: Context, count: number) {
    return context.$axios.get(resource + `/${count}`);
  },
  createNewFA(context: Context, FA: FA) {
    return context.$axios.$post(resource, FA);
  },
  deleteFA(context: Context, FA: FA) {
    return context.$axios.delete(resource, { data: FA });
  },
  getFAsNumber(context: Context) {
    return context.$axios.get(resource + "/count");
  },

  updateFA(context: Context, id: number, FA: fa_general_update) {
    return context.$axios.post(resource + `/${id}`, FA);
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
  updateFATimeWindows(
    context: Context,
    id: number,
    time_windows: time_windows[]
  ) {
    return context.$axios.post(`/time-windows/${id}`, time_windows);
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
  updateFAComments(context: Context, id: number, comments: fa_comments[]) {
    //Omit all User_Author
    const comments_update: fa_comments_update[] = comments.map(
      ({ id, comment, author, subject, created_at }) => ({
        id,
        comment,
        author,
        subject,
        created_at,
      })
    );
    return context.$axios.post(`/fa-comment/${id}`, comments_update);
  },
  validateFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/validate/${id}`, body);
  },
  refuseFA(context: Context, id: number, body: fa_validation_body) {
    return context.$axios.post(resource + `/invalidate/${id}`, body);
  },
};
