import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { FA } from "~/utils/models/FA";

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
  updateFA(context: Context, FA: FA) {
    return context.$axios.put(resource, FA);
  },
  deleteFAByCount(context: Context, count: number) {
    return context.$axios.delete(resource + `/${count}`);
  },
};
