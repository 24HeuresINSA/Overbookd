import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  AddInquiryRequestForm,
  FestivalTaskCreationForm,
  HttpStringified,
  UpdateGeneralForm,
  UpdateInstructionsForm,
} from "@overbookd/http";
import {
  PreviewFestivalTask,
  FestivalTask,
  InquiryRequest,
} from "@overbookd/festival-event";

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

  /* UPDATE INQUIRY */
  static addInquiryRequest(
    context: Context,
    ftId: FestivalTask["id"],
    inquiry: AddInquiryRequestForm,
  ) {
    return context.$axios.post<HttpStringified<FestivalTask>>(
      `${this.basePath}/${ftId}/inquiry/requests`,
      inquiry,
    );
  }

  static removeInquiryRequest(
    context: Context,
    ftId: FestivalTask["id"],
    inquirySlug: InquiryRequest["slug"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalTask>>(
      `${this.basePath}/${ftId}/inquiry/requests/${inquirySlug}`,
    );
  }
}
