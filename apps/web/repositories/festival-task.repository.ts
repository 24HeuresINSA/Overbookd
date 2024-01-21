import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { FestivalTaskCreationForm, HttpStringified } from "@overbookd/http";
import { PreviewFestivalTask, FestivalTask } from "@overbookd/festival-event";

type Context = { $axios: NuxtAxiosInstance };

export class FestivalTaskRepository {
  private static readonly basePath = "festival-tasks";

  /* FETCH */
  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<PreviewFestivalTask>[]>(
      this.basePath,
    );
  }

  static getOne(context: Context, id: FestivalTask["id"]) {
    return context.$axios.get<HttpStringified<FestivalTask>>(
      `${this.basePath}/${id}`,
    );
  }

  /* CREATE */
  static create(context: Context, data: FestivalTaskCreationForm) {
    return context.$axios.post<HttpStringified<FestivalTask>>(
      this.basePath,
      data,
    );
  }

  /* REMOVE */
  static remove(context: Context, id: FestivalTask["id"]) {
    return context.$axios.delete<void>(`${this.basePath}/${id}`);
  }
}
