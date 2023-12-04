import { NuxtAxiosInstance } from "@nuxtjs/axios";

type Context = { $axios: NuxtAxiosInstance };

export async function getImage(
  context: Context,
  basePath: string,
  id: number,
  route: string,
): Promise<string | undefined> {
  const token = context.$axios.defaults.headers.common["Authorization"];
  if (!token) return undefined;
  const response = await fetch(
    `${process.env.BASE_URL}${basePath}/${id}/${route}`,
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
