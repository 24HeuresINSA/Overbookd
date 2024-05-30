import type { HttpStringified } from "@overbookd/http";

type HttpResponse<T extends object> = HttpStringified<T> | Error;

async function apiFetch<T extends object>(
  params: HttpRequestParams,
): Promise<HttpResponse<T>> {
  const config = useRuntimeConfig();

  const { url, method } = params;
  const fullUrl = `${config.public.baseURL}/${url}`;
  const body =
    isRequestWithBody(params) && params.body
      ? JSON.stringify(params.body)
      : undefined;

  const headers = {
    ...(params.options.isJsonContent && {
      "Content-Type": "application/json",
    }),
    ...(params.options.withToken && {
      Authorization: `Bearer ${useCookie("accessToken").value}`,
    }),
  };

  const options: RequestInit = { method, headers, body };

  const res = await fetch(fullUrl, options);
  const data = await res.json();
  if (!res.ok) return new Error(data.message);
  return data;
}

type HttpRequestOptions = {
  withToken?: boolean;
  isJsonContent?: boolean;
};

const defaultOptions: HttpRequestOptions = {
  withToken: true,
  isJsonContent: true,
};

type HttpRequestParamsWithoutBody = {
  url: string;
  method: "GET" | "DELETE";
  options: HttpRequestOptions;
};

type HttpRequestParamsWithBody = {
  url: string;
  method: "POST" | "PUT" | "PATCH";
  body: object;
  options: HttpRequestOptions;
};

type HttpRequestParams =
  | HttpRequestParamsWithoutBody
  | HttpRequestParamsWithBody;

export class HttpRequest {
  static get<T extends object>(
    url: string,
    options: HttpRequestOptions = defaultOptions,
  ): Promise<HttpResponse<T>> {
    const params: HttpRequestParamsWithoutBody = {
      url,
      method: "GET",
      options,
    };
    return apiFetch<T>(params);
  }

  static post<T extends object>(
    url: string,
    body: object,
    options: HttpRequestOptions = defaultOptions,
  ): Promise<HttpResponse<T>> {
    const params: HttpRequestParamsWithBody = {
      url,
      method: "POST",
      body,
      options,
    };
    return apiFetch<T>(params);
  }

  static put<T extends object>(
    url: string,
    body: object,
    options: HttpRequestOptions = defaultOptions,
  ): Promise<HttpResponse<T>> {
    const params: HttpRequestParamsWithBody = {
      url,
      method: "PUT",
      body,
      options,
    };
    return apiFetch<T>(params);
  }

  static patch<T extends object>(
    url: string,
    body: object,
    options: HttpRequestOptions = defaultOptions,
  ): Promise<HttpResponse<T>> {
    const params: HttpRequestParamsWithBody = {
      url,
      method: "PATCH",
      body,
      options,
    };
    return apiFetch<T>(params);
  }

  static delete<T extends object>(
    url: string,
    options: HttpRequestOptions = defaultOptions,
  ): Promise<HttpResponse<T>> {
    const params: HttpRequestParamsWithoutBody = {
      url,
      method: "DELETE",
      options,
    };
    return apiFetch<T>(params);
  }
}

export function isSuccess<T extends object>(
  res: HttpResponse<T>,
): res is HttpStringified<T> {
  return !(res instanceof Error);
}

function isRequestWithBody(
  params: HttpRequestParams,
): params is HttpRequestParamsWithBody {
  return "body" in params;
}
