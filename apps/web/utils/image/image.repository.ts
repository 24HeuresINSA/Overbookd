import { NuxtAxiosInstance } from "@nuxtjs/axios";

type Context = { $axios: NuxtAxiosInstance };

export class ImageRepository {
  static async getImage(
    context: Context,
    path: string,
  ): Promise<string | undefined> {
    const token = context.$axios.defaults.headers.common["Authorization"];
    if (!token) return undefined;
    const response = await fetch(new URL(path, process.env.BASE_URL), {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    if (response.status !== 200) return undefined;
    const url = URL.createObjectURL(await response.blob());
    return url;
  }
}
