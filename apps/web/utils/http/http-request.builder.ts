import {
  apiFetch,
  type HttpRequestOptions,
  type HttpResponse,
} from "./api-fetch";

const defaultOptions: HttpRequestOptions = {
  withToken: true,
  isJsonContent: true,
};

type MethodWithBody = "POST" | "PUT" | "PATCH";
type MethodWithoutBody = "GET" | "DELETE";
export type Method = MethodWithBody | MethodWithoutBody;

abstract class HttpRequestBuilderBase<T extends object> {
  protected url: string;
  protected method: Method;
  protected options: HttpRequestOptions = defaultOptions;

  protected constructor(url: string, method: Method) {
    this.url = url;
    this.method = method;
  }

  withOptions(options: Partial<HttpRequestOptions>): this {
    this.options = { ...this.options, ...options };
    return this;
  }

  abstract execute(): Promise<HttpResponse<T>>;
}

class HttpRequestBuilderWithBody<
  T extends object,
> extends HttpRequestBuilderBase<T> {
  private body?: object;

  constructor(url: string, method: MethodWithBody) {
    super(url, method);
  }

  withBody(body: object): this {
    this.body = body;
    return this;
  }

  async execute(): Promise<HttpResponse<T>> {
    return apiFetch<T>(this.url, this.method, this.options, this.body);
  }
}

class HttpRequestBuilderWithoutBody<
  T extends object,
> extends HttpRequestBuilderBase<T> {
  constructor(url: string, method: MethodWithoutBody) {
    super(url, method);
  }

  async execute(): Promise<HttpResponse<T>> {
    return apiFetch<T>(this.url, this.method, this.options);
  }
}

export class HttpRequestBuilder {
  static get<T extends object>(url: string): HttpRequestBuilderWithoutBody<T> {
    return new HttpRequestBuilderWithoutBody<T>(url, "GET");
  }

  static post<T extends object>(url: string): HttpRequestBuilderWithBody<T> {
    return new HttpRequestBuilderWithBody<T>(url, "POST");
  }

  static put<T extends object>(url: string): HttpRequestBuilderWithBody<T> {
    return new HttpRequestBuilderWithBody<T>(url, "PUT");
  }

  static patch<T extends object>(url: string): HttpRequestBuilderWithBody<T> {
    return new HttpRequestBuilderWithBody<T>(url, "PATCH");
  }

  static delete<T extends object>(
    url: string,
  ): HttpRequestBuilderWithoutBody<T> {
    return new HttpRequestBuilderWithoutBody<T>(url, "DELETE");
  }
}
