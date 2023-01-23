import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Feedback } from "~/utils/models/feedback";
import {
  FTCreation,
  SearchFT,
  FTUpdate,
  FT,
  FTTimeWindowUpdate,
} from "~/utils/models/ft";
import { HttpStringified } from "~/utils/types/http";

const resource = "/ft";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFTs(context: Context, search?: SearchFT) {
    return context.$axios.get<FT[]>(resource, { params: search });
  },
  getFT(context: Context, id: number) {
    return context.$axios.get<FT>(`${resource}/${id}`);
  },
  createFT(context: Context, FT: FTCreation) {
    return context.$axios.post<FT>(resource, FT);
  },
  updateFT(context: Context, FT: FTUpdate) {
    return context.$axios.patch(`${resource}/${FT.id}`, FT);
  },
  deleteFT(context: Context, id: number) {
    return context.$axios.delete(`${resource}/${id}`);
  },
  updateFTTimeWindows(
    context: Context,
    ftId: number,
    timeWindows: FTTimeWindowUpdate[]
  ) {
    return context.$axios.post<HttpStringified<FTTimeWindowUpdate>[]>(
      `${resource}/${ftId}/time-windows`,
      timeWindows
    );
  },
  deleteFTTimeWindow(context: Context, ftId: number, twId: number) {
    return context.$axios.delete(`${resource}/${ftId}/time-windows/${twId}`);
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
