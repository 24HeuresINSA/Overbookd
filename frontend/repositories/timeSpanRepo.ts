import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/timeSpan";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAll(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  getTimeSpanByFTID(context: Context, FTID: string) {
    return context.$axios.get(`${resource}/user/FT/${FTID}`);
  },
  assignUserToTimeSpan(context: Context, timeSpanId: string, userId: string) {
    return context.$axios.post(`${resource}/${timeSpanId}/assigned/${userId}`);
  },
  unassignUserFromTimeSpan(context: Context, timeSpanId: string) {
    return context.$axios.post(`${resource}/${timeSpanId}/unassign`);
  },
  getAvailableTimeSpansForUser(context: Context, userId: string) {
    return context.$axios.get(`${resource}/available/${userId}`);
  },
  getUserAssignedTimeSpans(context: Context, userId: string) {
    return context.$axios.get(`${resource}/user/${userId}`);
  },
  getUserAssignedToSameTimeSpan(context: Context, timeSpanId: string) {
    return context.$axios.get(`${resource}/user/affected/${timeSpanId}`);
  },
  getAvailableUserForTimeSpan(
    context: Context,
    timeSpanId: string,
    bypass: boolean = false
  ) {
    return context.$axios.get(
      `${resource}/availableUserByTimespan/${timeSpanId}?bypass=${bypass}`
    );
  },
  getTotalNumberOfTimeSpansAndAssignedTimeSpansByFTID(
    context: Context,
    FTID: string
  ) {
    return context.$axios.get(`${resource}/count/${FTID}`);
  },
  getRolesByFT(context: Context) {
    return context.$axios.get(`${resource}/rolesByFT`);
  },
  deleteTimeSpan(context: Context, timeSpanId: string) {
    return context.$axios.delete(`${resource}/${timeSpanId}`);
  },
};
