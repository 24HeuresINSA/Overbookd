export class ImageRepository {
  static async getImage(url: string): Promise<string | Error> {
    const config = useRuntimeConfig();
    const fullUrl = `${config.public.baseURL}/${url}`;

    const accessToken = useCookie(ACCESS_TOKEN).value;
    const requestOptions: RequestInit = {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    };

    const res = await fetch(fullUrl, requestOptions);
    if (!res.ok) return new Error(res.statusText);

    return URL.createObjectURL(await res.blob());
  }
}
