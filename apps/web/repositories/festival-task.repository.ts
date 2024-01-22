import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  FestivalTaskCreationForm,
  HttpStringified,
  UpdateGeneralForm,
  UpdateInstructionsForm,
} from "@overbookd/http";
import { PreviewFestivalTask, FestivalTask } from "@overbookd/festival-event";

type Context = { $axios: NuxtAxiosInstance };

export class FestivalTaskRepository {
  private static readonly basePath = "festival-tasks";

  /* VIEW */
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

  /* UPDATE GENERAL */
  static updateGeneral(
    context: Context,
    ftId: FestivalTask["id"],
    general: UpdateGeneralForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalTask>>(
      `${this.basePath}/${ftId}/general`,
      general,
    );
  }

  /* UPDATE INSTRUCTIONS */
  static updateInstructions(
    context: Context,
    ftId: FestivalTask["id"],
    instructions: UpdateInstructionsForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalTask>>(
      `${this.basePath}/${ftId}/instructions`,
      instructions,
    );
  }
}
