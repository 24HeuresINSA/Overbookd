import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { HttpStringified } from "~/utils/types/http";
import {
  CreateFestivalActivityForm,
  FestivalActivity,
  PrepareFeedbackPublish,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";

type Context = { $axios: NuxtAxiosInstance };

export class FestivalActivityRepository {
  private static readonly basePath = "festival-activity";

  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<PreviewFestivalActivity>[]>(
      this.basePath,
    );
  }

  static getOne(context: Context, id: number) {
    return context.$axios.get<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${id}`,
    );
  }

  static create(context: Context, data: CreateFestivalActivityForm) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      this.basePath,
      data,
    );
  }

  static publishFeedback(
    context: Context,
    faId: number,
    feedback: PrepareFeedbackPublish,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/feedback`,
      feedback,
    );
  }
}
