import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Configuration } from "~/utils/models/configuration";
import { HttpStringified } from "~/utils/types/http";
const resource = "/configuration";

type Context = { $axios: NuxtAxiosInstance };

export default {
  getAll(context: Context) {
    return context.$axios.get<HttpStringified<Configuration[]>>(`${resource}`);
  },

  fetch(context: Context, key: string) {
    return context.$axios.get<HttpStringified<Configuration>>(
      `${resource}/${key}`
    );
  },

  update(context: Context, config: Configuration) {
    return context.$axios.put<HttpStringified<Configuration>>(
      `${resource}/${config.key}`,
      { value: config.value }
    );
  },
};
