import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { SignageSearchOptions, Signage, SignageForm } from "@overbookd/signa";

export type Context = { $axios: NuxtAxiosInstance };

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static searchSignages(
    context: Context,
    searchOptions?: SignageSearchOptions,
  ) {
    return context.$axios.get<Signage[]>(this.basePath, {
      params: searchOptions,
    });
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
