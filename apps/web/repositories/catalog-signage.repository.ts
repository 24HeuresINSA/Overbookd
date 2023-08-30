import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Signage, SignageForm } from "@overbookd/signa";

export type Context = { $axios: NuxtAxiosInstance };

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static searchSignages(context: Context) {
    return context.$axios.get<Signage[]>(this.basePath);
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
    return context.$axios.$delete(`${this.basePath}/${signageId}`);
  }
}
