import { NuxtAxiosInstance } from "@nuxtjs/axios";

type Context = { $axios: NuxtAxiosInstance };

const resource = "/planning";

export default {
  createPlanning(context: Context, userId: string) {
    return context.$axios.post(`${resource}/create/${userId}`);
  },
  createAllPlanning(context: Context) {
    return context.$axios.get(`${resource}/createall`);
  },
};
