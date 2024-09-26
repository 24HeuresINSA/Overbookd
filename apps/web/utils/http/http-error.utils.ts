import type { ApiResponse, HttpResponse } from "./api-fetch";

export function isHttpError<T extends ApiResponse>(
  res: HttpResponse<T>,
): res is Error {
  return res instanceof Error;
}
