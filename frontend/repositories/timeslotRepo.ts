import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { timeslot } from "~/utils/models/repo";

const resource = "/timeslot";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAll(context: Context) {
    return context.$axios.get(`${resource}`);
  },
  getById(context: Context, id: string) {
    return context.$axios.get(`${resource}/${id}`);
  },

  // POST
  createMany(context: Context, timeslot: timeslot[]) {
    return context.$axios.post(`${resource}/many`, timeslot);
  },

  create(context: Context, timeslot: timeslot) {
    return context.$axios.post(`${resource}`, timeslot);
  },

  // DELETE
  delete(context: Context, id: string) {
    return context.$axios.delete(`${resource}/${id}`);
  },

  // PUT
  update(context: Context, id: string, charisma: number) {
    return context.$axios.put(`${resource}/${id}/${charisma}`);
  },
};
