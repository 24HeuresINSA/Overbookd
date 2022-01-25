import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/config";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getConfig(context: Context) {
    return context.$axios.get(`${resource}`);
  },

  // PUT
  setConfig(context: Context, config: any) {
    return context.$axios.put(`${resource}`, [config]);
  },
};
