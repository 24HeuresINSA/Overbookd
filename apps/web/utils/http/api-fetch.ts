import type { HttpStringified } from "@overbookd/http";
import { CSV, ICAL, JSON as JSON_TYPE, PDF } from "@overbookd/http";

type MethodWithBody = "POST" | "PUT" | "PATCH";
type MethodWithoutBody = "GET" | "DELETE";
export type Method = MethodWithBody | MethodWithoutBody;

export type RequestGeneral = {
  url: URL;
  method: Method;
};

type AcceptedType = typeof JSON_TYPE | typeof CSV | typeof ICAL | typeof PDF;
export type RequestOptions = {
  acceptedType: AcceptedType;
  serverErrorMessage: string;
};

export type ApiResponse = object | string | number | void;

type Success<T extends ApiResponse> = T extends object
  ? HttpStringified<T>
  : T extends string
    ? string
    : T extends number
      ? number
      : void;

export type HttpResponse<T extends ApiResponse> = Success<T> | Error;

type EmptyOr<T extends Record<string, unknown>> = T | Record<never, unknown>;

export async function apiFetch<T extends ApiResponse>(
  { url, method }: RequestGeneral,
  { acceptedType, serverErrorMessage }: RequestOptions,
  body?: object,
): Promise<HttpResponse<T>> {
  const requestOptions = createRequestOptions(method, acceptedType, body);
  const res = await fetch(url.toString(), requestOptions); // nosemgrep
  if (!res.ok) return handleFetchError(res, serverErrorMessage);
  return handleFetchResponse<T>(res, acceptedType);
}

function createRequestOptions(
  method: string,
  acceptedType: AcceptedType,
  body?: object,
): RequestInit {
  const isFormData = body instanceof FormData;
  const contentType = isFormData ? undefined : JSON_TYPE;
  const headers = createHeaders(acceptedType, contentType);
  const formattedBody = formatRequestBody(body);
  return { method, headers, body: formattedBody };
}

function createHeaders(
  acceptedType: AcceptedType,
  contentType?: typeof JSON_TYPE,
): HeadersInit {
  const contentTypeObject: EmptyOr<{ "Content-Type": string }> = contentType
    ? { "Content-Type": contentType }
    : {};

  const accessToken = useCookie("accessToken").value;
  const authorization: EmptyOr<{ Authorization: string }> = accessToken
    ? { Authorization: `Bearer ${accessToken}` }
    : {};
  const accept = { Accept: acceptedType };

  return { ...contentTypeObject, ...authorization, ...accept };
}

function formatRequestBody(body?: object): string | FormData | undefined {
  if (!body) return undefined;
  const isFormData = body instanceof FormData;
  return isFormData ? body : JSON.stringify(body);
}

async function handleFetchError(
  res: Response,
  serverErrorMessage: string,
): Promise<Error> {
  const error = await res.json();
  const isServerError = res.status >= 500 && res.status < 600;
  const message = isServerError
    ? serverErrorMessage
    : error.message || res.statusText;
  sendFailureNotification(message);
  return new Error(message);
}

async function handleFetchResponse<T extends ApiResponse>(
  res: Response,
  acceptedType: AcceptedType,
): Promise<HttpResponse<T>> {
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
