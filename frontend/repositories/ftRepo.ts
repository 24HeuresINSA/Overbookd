import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { FormComment } from "~/utils/models/Comment";
import { FT } from "~/utils/models/FT";

const resource = "/ft";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFTs(context: Context) {
    return context.$axios.get(resource);
  },
  getFT(context: Context, id: string) {
    return context.$axios.get(`${resource}/${id}`);
  },
  createFT(context: Context, FT: Partial<FT>) {
    return context.$axios.post(resource, FT);
  },
  updateFT(context: Context, FT: FT) {
    return context.$axios.put(resource, FT);
  },
  deleteFT(context: Context, FT: FT) {
    return context.$axios.delete(resource, { data: FT });
  },
  markAsReady(context: Context, FTCount: number, comment: FormComment) {
    return context.$axios.post(`${resource}/${FTCount}/ready`, { comment });
  },
  getFTsNumber(context: Context) {
    return context.$axios.get(resource + "/count");
  },
  getOrgaRequis(context: Context) {
    return context.$axios.get(resource + "/orga-requis");
  },
  myPlanning(context: Context, userId: string) {
    return context.$axios.get(`${resource}/orga-requis/${userId}`);
  },
};
