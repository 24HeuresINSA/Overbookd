import { NuxtAxiosInstance } from "@nuxtjs/axios";

type Context = { $axios: NuxtAxiosInstance };

export async function getImage(
  context: Context,
  path: string,
): Promise<string | undefined> {
  const token = context.$axios.defaults.headers.common["Authorization"];
  if (!token) return undefined;
  const response = await fetch(`${process.env.BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: `${token}`,
    },
  });
  if (response.status !== 200) return undefined;
  const url = URL.createObjectURL(await response.blob());
  return url;
}
