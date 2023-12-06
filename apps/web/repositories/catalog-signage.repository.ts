import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Signage, SignageForm } from "@overbookd/signa";
import { getImage } from "~/utils/image/image.repository";

export type Context = { $axios: NuxtAxiosInstance };

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static fetchSignages(context: Context) {
    return context.$axios.get<Signage[]>(this.basePath);
  }

  static async getSignageImage(
    context: Context,
    signageId: number,
  ): Promise<string | undefined> {
    const path = `${this.basePath}/${signageId}/image`;
    return getImage(context, path);
  }

  static createSignage(context: Context, signageForm: SignageForm) {
    return context.$axios.post<Signage>(this.basePath, signageForm);
  }

  static updateSignage(
    context: Context,
    signageId: number,
    signageForm: SignageForm,
  ) {
    return context.$axios.put<Signage>(
      `${this.basePath}/${signageId}`,
      signageForm,
    );
  }

  static deleteSignage(context: Context, signageId: number) {
    return context.$axios.delete(`${this.basePath}/${signageId}`);
  }

  static uploadSignageImage(
    context: Context,
    signageId: number,
    signageImage: FormData,
  ) {
    return context.$axios.post<Signage>(
      `${this.basePath}/${signageId}/image`,
      signageImage,
    );
  }
}
