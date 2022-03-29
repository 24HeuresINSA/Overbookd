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

  unassignUserFromTimespan(context: Context, timespanId: string) {
    return context.$axios.post(`${resource}/${timespanId}/unassign`);
  },
  getAvailableTimespansForUser(context: Context, userId: string) {
    return context.$axios.get(`${resource}/available/${userId}`);
  },
  getUserAssignedTimespans(context: Context, userId: string) {
    return context.$axios.get(`${resource}/user/${userId}`);
  },
};
