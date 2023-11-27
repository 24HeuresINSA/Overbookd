import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Signage, SignageForm } from "@overbookd/signa";

export type Context = { $axios: NuxtAxiosInstance };

export class CatalogSignageRepository {
  private static readonly basePath = "signages";

  static fetchSignages(context: Context) {
    return context.$axios.get<Signage[]>(this.basePath);
  }

  static async fetchSignagePicture(
    context: Context,
    signageId: number,
  ): Promise<string | undefined> {
    const token = context.$axios.defaults.headers.common["Authorization"];
    if (!token) return undefined;

    const response = await fetch(
      `${process.env.BASE_URL}${this.basePath}/${signageId}/image`,
      {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      },
    );

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
  static uploadSignageImage(context: Context, signageId: number, image: FormData) {
    return context.$axios.post(`${this.basePath}/${signageId}/image`, image);
  }
}
