import { NuxtAxiosInstance } from "@nuxtjs/axios";

const resource = "/equipment";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllEquipments(context: Context) {
    return context.$axios.get(resource);
  },
  setEquipment(context: Context, equipement: any) {
    return context.$axios.put(resource, equipement);
  },
};
