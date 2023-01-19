import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Feedback } from "~/utils/models/feedback";
import { FTCreation, SearchFT, FTUpdate } from "~/utils/models/ft";

const resource = "/ft";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFTs(context: Context, search?: SearchFT) {
    return context.$axios.get(resource, { params: search });
  },
  getFT(context: Context, id: number) {
    return context.$axios.get(`${resource}/${id}`);
  },
  createFT(context: Context, FT: FTCreation) {
    return context.$axios.post(resource, FT);
  },
  updateFT(context: Context, FT: FTUpdate) {
    return context.$axios.put(resource, FT);
  },
  deleteFT(context: Context, id: number) {
    return context.$axios.delete(`${resource}/${id}`);
  },
  markAsReady(context: Context, FTCount: number, comment: Feedback) {
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
