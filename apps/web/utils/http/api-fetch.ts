import type { HttpStringified } from "@overbookd/http";
import { CSV, ICAL, JSON as JSON_TYPE, PDF } from "@overbookd/http";

type MethodWithBody = "POST" | "PUT" | "PATCH";
type MethodWithoutBody = "GET" | "DELETE";
export type Method = MethodWithBody | MethodWithoutBody;

export type RequestGeneral = {
  url: URL;
  method: Method;
};

export type RequestHeader = {
  acceptedType: typeof JSON_TYPE | typeof CSV | typeof ICAL | typeof PDF;
};

export type ApiResponse = object | void;

type Success<T extends ApiResponse> = T extends object
  ? HttpStringified<T>
  : void;

export type HttpResponse<T extends ApiResponse> = Success<T> | Error;

type EmptyOr<T extends Record<string, unknown>> = T | Record<never, unknown>;

export async function apiFetch<T extends ApiResponse>(
  { url, method }: RequestGeneral,
  { acceptedType }: RequestHeader,
  body?: object,
): Promise<HttpResponse<T>> {
  const accessToken = useCookie("accessToken").value;
  const contentType = { "Content-Type": JSON_TYPE };
  const authorization: EmptyOr<{ Authorization: string }> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
  const accept = { Accept: acceptedType };
  const headers = { ...contentType, ...authorization, ...accept };

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, requestOptions);
  const data = await res.json();

  if (!res.ok) return new Error(data.message || res.statusText);
  return data;
}

export function isSuccess<T extends ApiResponse>(
  res: HttpResponse<T>,
): res is Success<T> {
  return !(res instanceof Error);
}

export function isError<T extends ApiResponse>(
  res: HttpResponse<T>,
): res is Error {
  return res instanceof Error;
}
