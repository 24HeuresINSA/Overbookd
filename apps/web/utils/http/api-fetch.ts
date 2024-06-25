import type { HttpStringified } from "@overbookd/http";
import { CSV, ICAL, JSON as JSON_TYPE, PDF } from "@overbookd/http";
import { sendNotification } from "../notification/send-notification";

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

export type ApiResponse = object | string | void;

type Success<T extends ApiResponse> = T extends object
  ? HttpStringified<T>
  : T extends string
    ? string
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

  if (!res.ok) {
    const message = data.message || res.statusText;
    sendNotification(message);
    return new Error(message);
  }
  return data;
}

export function isHttpError<T extends ApiResponse>(
  res: HttpResponse<T>,
): res is Error {
  return res instanceof Error;
}
