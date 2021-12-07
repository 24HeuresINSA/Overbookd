import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { availability } from "~/utils/models/repo";

const resource = "/timeslot";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllAvailabilities(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  getUserAvailabilities(context: Context, userId: string) {
    return context.$axios.get(`${resource}/${userId}`);
  },

  // POST
  createAvailabilities(context: Context, availabilities: availability[]) {
    return context.$axios.post(`${resource}`, availabilities);
  },
  createUserAvailabilities(
    context: Context,
    userId: string,
    availabilities: availability[]
  ) {
    return context.$axios.post(`${resource}/${userId}`, availabilities);
  },

  // DELETE
  deleteAvailabilities(context: Context, availabilityId: string) {
    return context.$axios.delete(`${resource}/${availabilityId}`);
  },
};
