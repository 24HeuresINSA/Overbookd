import { QueryParamsValue } from "./festival-activity/festival-activity.filter";

export function strigifyQueryParam(param?: QueryParamsValue): string {
  if (Array.isArray(param)) return "";
  return param ?? "";
}

export function nonEmptyString(value: string): string | undefined {
  return value ? value : undefined;
}
