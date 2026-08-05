import { useOidcUtils } from "~/composable/useOidcUtils";

export class ImageRepository {
  static async getImage(url: string): Promise<string | Error> {
    const { getUserAuthorizationHeader } = useOidcUtils();
    const config = useRuntimeConfig();
    const fullUrl = `${config.public.apiURL}/${url}`;

    const authorization = getUserAuthorizationHeader();
    const requestOptions: RequestInit = {
      method: "GET",
      headers: authorization,
    };

    const res = await fetch(fullUrl, requestOptions);
    if (!res.ok) return new Error(res.statusText);

    return URL.createObjectURL(await res.blob());
  }
}
