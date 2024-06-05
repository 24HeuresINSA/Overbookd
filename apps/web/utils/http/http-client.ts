import { apiFetch, type HttpResponse } from "./api-fetch";

type MethodWithBody = "POST" | "PUT" | "PATCH";
type MethodWithoutBody = "GET" | "DELETE";
export type Method = MethodWithBody | MethodWithoutBody;

export class HttpClient {
  private constructor() {}

  static get<T extends object>(path: string): Promise<HttpResponse<T>> {
    return apiFetch<T>(path, "GET");
  }

  static post<T extends object>(
    path: string,
    body: object,
  ): Promise<HttpResponse<T>> {
    return apiFetch<T>(path, "POST", body);
  }

  static put<T extends object>(
    path: string,
    body: object,
  ): Promise<HttpResponse<T>> {
    return apiFetch<T>(path, "PUT", body);
  }

  static patch<T extends object>(
    path: string,
    body: object,
  ): Promise<HttpResponse<T>> {
    return apiFetch<T>(path, "PATCH", body);
  }

  static delete(path: string): Promise<HttpResponse<void>> {
    return apiFetch<void>(path, "DELETE");
  }
}
