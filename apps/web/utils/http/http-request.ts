import type { HttpStringified } from "@overbookd/http";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type HttpResponse<T extends object> = HttpStringified<T> | Error;

async function apiFetch<T extends object>(
  url: string,
  method: Method,
  body?: object,
): Promise<HttpResponse<T>> {
  const config = useRuntimeConfig();

  const fullUrl = `${config.public.baseURL}/${url}`;
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(fullUrl, options);
  const data = await res.json();
  if (!res.ok) return new Error(data.message);
  return data;
}

export class HttpRequest {
  static get<T extends object>(url: string): Promise<HttpResponse<T>> {
    return apiFetch<T>(url, "GET");
  }

  static post<T extends object>(
    url: string,
    body: object,
  ): Promise<HttpResponse<T>> {
    return apiFetch<T>(url, "POST", body);
  }

  static put<T extends object>(
    url: string,
    body: object,
  ): Promise<HttpResponse<T>> {
    return apiFetch<T>(url, "PUT", body);
  }

  static patch<T extends object>(
    url: string,
    body: object,
  ): Promise<HttpResponse<T>> {
    return apiFetch<T>(url, "PATCH", body);
  }

  static delete<T extends object>(url: string): Promise<HttpResponse<T>> {
    return apiFetch<T>(url, "DELETE");
  }
}

export function isSuccess<T extends object>(
  res: HttpResponse<T>,
): res is HttpStringified<T> {
  return !(res instanceof Error);
}
