export type QueryParamsValue = string | (string | null)[];

export function strigifyQueryParam(param?: QueryParamsValue): string {
  if (Array.isArray(param)) return "";
  return param ?? "";
}

export function nonEmptyString(value: string): string | undefined {
  return value ? value : undefined;
}
