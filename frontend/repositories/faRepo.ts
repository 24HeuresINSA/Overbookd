import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  FA,
  fa_general_update,
  fa_collaborators,
  fa_signa_needs,
  time_windows,
  fa_electricity_needs,
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
};
