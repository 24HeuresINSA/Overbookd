import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Configuration } from "~/utils/models/Configuration";
const resource = "/configuration";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAll(context: Context) {
    return context.$axios.get(`${resource}`);
  },

  get(context: Context, key: string) {
    return context.$axios.get(`${resource}/${key}`);
  },
  // PUT
  set(context: Context, config: Configuration) {
    return context.$axios.post(`${resource}`, config);
  },
  // PATCH
  update(context: Context, config: Configuration) {
    return context.$axios.put(`${resource}`, config);
  },
};
