import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Signage, SignageForm } from "@overbookd/signa";

export type Context = { $axios: NuxtAxiosInstance };

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static fetchSignages(context: Context) {
    return context.$axios.get<Signage[]>(this.basePath);
  }

  static async fetchSignageImage(
    context: Context,
    signageId: number,
  ): Promise<string | undefined> {
    const token = context.$axios.defaults.headers.common["Authorization"];
    if (!token) return undefined;

    const urltest = `${process.env.BASE_URL}${this.basePath}/${signageId}/image`;
    const response = await fetch(
      urltest,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    console.log(urltest);
    if (response.status !== 200) return undefined;

    const url = URL.createObjectURL(await response.blob());
    return url;
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

  static uploadSignageImage(context: Context, signageId: number, signageImage: FormData) {
    return context.$axios.post<Signage>(
      `${this.basePath}/${signageId}/image`,
      signageImage,
    );
  }
}
