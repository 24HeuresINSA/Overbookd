import { JSON } from "@overbookd/http";
import type { RequestGeneral, RequestOptions, HttpResponse } from "./api-fetch";
import { apiFetch } from "./api-fetch";
import { HttpParams, type Params } from "./http-param";

type Endpoint = {
  path: string;
  params?: Params;
};

const DEFAULT_SERVER_ERROR_MESSAGE =
  "Oups, une erreur s'est produite.. Réessaie et contacte un admin si le problème persiste.";
const DEFAULT_OPTIONS: RequestOptions = {
  acceptedType: JSON,
  serverErrorMessage: DEFAULT_SERVER_ERROR_MESSAGE,
};

export class HttpClient {
  private constructor() {}

  static get<T extends object | string | number>(
    url: Endpoint | string,
    options?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "GET",
    };
    const requestOptions = { ...DEFAULT_OPTIONS, ...options };

    return apiFetch<T>(general, requestOptions);
  }

  static post<T extends object | string | void>(
    url: Endpoint | string,
    body?: object,
    options?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "POST",
    };
    const requestOptions = { ...DEFAULT_OPTIONS, ...options };
    return apiFetch<T>(general, requestOptions, body);
  }

  static put<T extends object | void>(
    url: Endpoint | string,
    body: object,
    options?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "PUT",
    };
    const requestOptions = { ...DEFAULT_OPTIONS, ...options };
    return apiFetch<T>(general, requestOptions, body);
  }

  static patch<T extends object | void>(
    url: Endpoint | string,
    body: object,
    options?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "PATCH",
    };
    const requestOptions = { ...DEFAULT_OPTIONS, ...options };
    return apiFetch<T>(general, requestOptions, body);
  }

  static delete<T extends object | void = void>(
    url: Endpoint | string,
    options?: Partial<RequestOptions>,
  ): Promise<HttpResponse<T>> {
    const general: RequestGeneral = {
      url: this.buildURL(url),
      method: "DELETE",
    };
    const requestOptions = { ...DEFAULT_OPTIONS, ...options };
    return apiFetch<T>(general, requestOptions);
  }

  private static buildURL(endpoint: Endpoint | string): URL {
    const path = this.isString(endpoint) ? endpoint : endpoint.path;
    const params = this.isString(endpoint) ? undefined : endpoint.params;

    const config = useRuntimeConfig();
    const url = new URL(`${config.public.baseURL}/${path}`);

    if (!params) return url;
    const urlParams = HttpParams.generate(params);
    url.search = urlParams.toString();
    return url;
  }

  private static isString(url: Endpoint | string): url is string {
    return typeof url === "string";
  }
}
