import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/timespan";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAll(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  getTimeSpanByFTID(context: Context, FTID: string) {
    return context.$axios.get(`${resource}/user/FT/${FTID}`);
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
  getUserAssignedToSameTimespan(context: Context, timespanId: string) {
    return context.$axios.get(`${resource}/user/affected/${timespanId}`);
  },
  getAvailableUserForTimeSpan(context: Context, timespanId: string, bypass: boolean = false) {
    return context.$axios.get(
      `${resource}/availableUserByTimespan/${timespanId}?bypass=${bypass}`
    );
  },
  getTotalNumberOfTimespansAndAssignedTimespansByFTID(
    context: Context,
    FTID: string
  ) {
    return context.$axios.get(`${resource}/count/${FTID}`);
  },
  getRolesByFT(context: Context) {
    return context.$axios.get(`${resource}/rolesByFT`);
  },
  deleteTimespan(context: Context, timespanId: string) {
    return context.$axios.delete(`${resource}/${timespanId}`);
  }
};
