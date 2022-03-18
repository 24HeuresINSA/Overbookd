import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/timespan";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAll(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  assignUserToTimespan(context: Context, timespanId: string, userId: string) {
    return context.$axios.post(`${resource}/${timespanId}/assigned/${userId}`);
  },
};
