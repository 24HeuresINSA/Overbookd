import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  HttpStringified,
  PrepareInChargeForm,
  PrepareSignaForm,
} from "@overbookd/http";
import {
  CreateFestivalActivityForm,
  FestivalActivity,
  PrepareFeedbackPublish,
  PrepareGeneralUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  Signage,
  TimeWindow,
} from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";

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

  static updateGeneral(
    context: Context,
    faId: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/general`,
      general,
    );
  }

  static addGeneralTimeWindow(
    context: Context,
    faId: FestivalActivity["id"],
    timeWindow: IProvidePeriod,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/general/time-windows`,
      timeWindow,
    );
  }

  static removeGeneralTimeWindow(
    context: Context,
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/general/time-windows/${timeWindowId}`,
    );
  }

  static updateInCharge(
    context: Context,
    faId: FestivalActivity["id"],
    inCharge: PrepareInChargeForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/in-charge`,
      inCharge,
    );
  }

  static updateSigna(
    context: Context,
    faId: FestivalActivity["id"],
    signa: PrepareSignaForm,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa`,
      signa,
    );
  }

  static addSignage(
    context: Context,
    faId: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ) {
    return context.$axios.post<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa/signages`,
      signage,
    );
  }

  static updateSignage(
    context: Context,
    faId: FestivalActivity["id"],
    update: PrepareSignageUpdate,
  ) {
    const { id, ...signage } = update;
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa/signages/${id}`,
      signage,
    );
  }

  static removeSignage(
    context: Context,
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
  ) {
    return context.$axios.delete<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/signa/signages/${signageId}`,
    );
  }

  static updateSecurity(
    context: Context,
    faId: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/security`,
      security,
    );
  }

  static updateSupply(
    context: Context,
    faId: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ) {
    return context.$axios.patch<HttpStringified<FestivalActivity>>(
      `${this.basePath}/${faId}/supply`,
      supply,
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
