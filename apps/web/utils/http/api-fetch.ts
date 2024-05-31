import type { HttpStringified } from "@overbookd/http";
import type { Method } from "./http-request.builder";

export type HttpResponse<T extends object> = HttpStringified<T> | Error;

export type HttpRequestOptions = {
  withToken: boolean;
  isJsonContent: boolean;
};

export async function apiFetch<T extends object>(
  url: string,
  method: Method,
  options?: HttpRequestOptions,
  body?: object,
): Promise<HttpResponse<T>> {
  const config = useRuntimeConfig();

  const fullUrl = `${config.public.baseURL}/${url}`;

  const headers: HeadersInit = {};
  if (options?.isJsonContent) {
    headers["Content-Type"] = "application/json";
  }
  if (options?.withToken) {
    headers["Authorization"] = `Bearer ${useCookie("accessToken").value}`;
  }

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(fullUrl, requestOptions);
  const data = await res.json();

  if (!res.ok) {
    return new Error(data.message || res.statusText);
  }

  return data;
}

export function isSuccess<T extends object>(
  res: HttpResponse<T>,
): res is HttpStringified<T> {
  return !(res instanceof Error);
}
