import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Feedback } from "~/utils/models/feedback";
import {
  FTCreation,
  SearchFT,
  FTUpdate,
  FT,
  FTTimeWindowUpdate,
  FTTimeWindow,
  FTSimplified,
} from "~/utils/models/ft";
import { HttpStringified } from "~/utils/types/http";

const resource = "/ft";
type Context = { $axios: NuxtAxiosInstance };

export default {
  getAllFTs(context: Context, search?: SearchFT) {
    return context.$axios.get<HttpStringified<FTSimplified>[]>(resource, {
      params: search,
    });
  },
  getFT(context: Context, id: number) {
    return context.$axios.get<HttpStringified<FT>>(`${resource}/${id}`);
  },
  createFT(context: Context, ft: FTCreation) {
    return context.$axios.post<HttpStringified<FT>>(resource, ft);
  },
  updateFT(context: Context, ft: FTUpdate) {
    return context.$axios.patch<HttpStringified<FT>>(
      `${resource}/${ft.id}`,
      ft
    );
  },
  deleteFT(context: Context, id: number) {
    return context.$axios.delete(`${resource}/${id}`);
  },
  updateFTTimeWindow(
    context: Context,
    ftId: number,
    timeWindow: FTTimeWindowUpdate
  ) {
    return context.$axios.post<HttpStringified<FTTimeWindow>>(
      `${resource}/${ftId}/time-windows`,
      timeWindow
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
