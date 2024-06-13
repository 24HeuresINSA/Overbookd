import { JSON } from "@overbookd/http";
import type { RequestGeneral, RequestHeader, HttpResponse } from "./api-fetch";
import { apiFetch } from "./api-fetch";

type Endpoint = {
  path: string;
  params?: object;
};

const DEFAULT_HEADER: RequestHeader = {
  acceptedType: JSON,
};

export class HttpClient {
  private constructor() {}

  static get<T extends object>(
    url: Endpoint | string,
    header?: Partial<RequestHeader>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "GET",
    };
    const requestHeader = { ...DEFAULT_HEADER, ...header };

    return apiFetch<T>(general, requestHeader);
  }

  static post<T extends object>(
    url: Endpoint | string,
    body?: object,
    header?: Partial<RequestHeader>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "POST",
    };
    const requestHeader = { ...DEFAULT_HEADER, ...header };
    return apiFetch<T>(general, requestHeader, body);
  }

  static put<T extends object>(
    url: Endpoint | string,
    body: object,
    header?: Partial<RequestHeader>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "PUT",
    };
    const requestHeader = { ...DEFAULT_HEADER, ...header };
    return apiFetch<T>(general, requestHeader, body);
  }

  static patch<T extends object>(
    url: Endpoint | string,
    body: object,
    header?: Partial<RequestHeader>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "PATCH",
    };
    const requestHeader = { ...DEFAULT_HEADER, ...header };
    return apiFetch<T>(general, requestHeader, body);
  }

  static delete<T extends object | void = void>(
    url: Endpoint | string,
    header?: Partial<RequestHeader>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "DELETE",
    };
    const requestHeader = { ...DEFAULT_HEADER, ...header };
    return apiFetch<T>(general, requestHeader);
  }

  private static buildURL(endpoint: Endpoint | string): URL {
    const path = this.isString(endpoint) ? endpoint : endpoint.path;
    const params = this.isString(endpoint) ? undefined : endpoint.params;

    const config = useRuntimeConfig();
    const url = new URL(`${config.public.baseURL}/${path}`);
    if (!params) return url;

    const entries = Object.entries(params);
    url.search = new URLSearchParams(entries).toString();
    return url;
  }

  private static isString(url: Endpoint | string): url is string {
    return typeof url === "string";
  }
}
