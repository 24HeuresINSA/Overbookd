import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { FA, fa_general_update } from "~/utils/models/FA";

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
  updateFA(context: Context, id: number, FA: fa_general_update) {
    return context.$axios.post(resource + `/${id}`, FA);
  },
  deleteFA(context: Context, FA: FA) {
    return context.$axios.delete(resource, { data: FA });
  },
  getFAsNumber(context: Context) {
    return context.$axios.get(resource + "/count");
  },
};
