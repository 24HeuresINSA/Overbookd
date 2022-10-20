import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/team";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getTeams(context: Context) {
    return context.$axios.get(resource);
  },
};
