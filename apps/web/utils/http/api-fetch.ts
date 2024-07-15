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
  const isFormData = body instanceof FormData;

  const accessToken = useCookie("accessToken").value;
  const contentType: EmptyOr<{ "Content-Type": string }> = isFormData
    ? {}
    : { "Content-Type": JSON_TYPE };
  const authorization: EmptyOr<{ Authorization: string }> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
  const accept = { Accept: acceptedType };
  const headers = { ...contentType, ...authorization, ...accept };

  const formattedBody = isFormData ? body : JSON.stringify(body);

  const requestOptions: RequestInit = {
    method,
    headers,
    body: body ? formattedBody : undefined,
  };

  const res = await fetch(url.toString(), requestOptions); // nosemgrep

  if (!res.ok) {
    const error = await res.json();
    const message = error.message || res.statusText;
    sendFailureNotification(message);
    return new Error(message);
  }

  if (res.status === 204) return undefined as Success<T>;

  if (acceptedType === JSON_TYPE) {
    const jsonResponse: T = await res.json();
    return jsonResponse as Success<T>;
  }

  if (acceptedType === PDF || acceptedType === CSV || acceptedType === ICAL) {
    const textResponse: string = await res.text();
    return textResponse as Success<T>;
  }

  return undefined as Success<T>;
}

export function isHttpError<T extends ApiResponse>(
  res: HttpResponse<T>,
): res is Error {
  return res instanceof Error;
}
