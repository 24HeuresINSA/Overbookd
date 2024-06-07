import type { HttpStringified } from "@overbookd/http";
import type { Method } from "./http-client";

type ApiResponse = object | void;

type Success<T extends ApiResponse> = T extends object
  ? HttpStringified<T>
  : void;

export type HttpResponse<T extends ApiResponse> = Success<T> | Error;

type EmptyOr<T extends Record<string, unknown>> = T | Record<never, unknown>;

export async function apiFetch<T extends ApiResponse>(
  url: string,
  method: Method,
  body?: object,
): Promise<HttpResponse<T>> {
  const config = useRuntimeConfig();

  const fullUrl = `${config.public.baseURL}/${url}`;

  const accessToken = useCookie("accessToken").value;
  const contentType = { "Content-Type": "application/json" };
  const authorization: EmptyOr<{ Authorization: string }> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
  const headers = { ...contentType, ...authorization };

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(fullUrl, requestOptions);
  const data = await res.json();

  if (!res.ok) return new Error(data.message || res.statusText);
  return data;
}

export function isSuccess<T extends ApiResponse>(
  res: HttpResponse<T>,
): res is Success<T> {
  return !(res instanceof Error);
}
