import { NuxtAxiosInstance } from "@nuxtjs/axios";
const resource = "/conflict";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getFTConflicts(context: Context, FTCount: number) {
    return context.$axios.get(`${resource}/ft/${FTCount}`);
  },
  getAllConflicts(context: Context) {
    return context.$axios.get(`${resource}/all`);
  },
  computeAll(context: Context) {
    return context.$axios.get(`${resource}/computeAll`);
  },
};
