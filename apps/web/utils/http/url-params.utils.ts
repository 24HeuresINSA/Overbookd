import type { LocationQueryValue } from "vue-router";

export function stringifyQueryParam(
  param?: LocationQueryValue | LocationQueryValue[],
): string {
  if (Array.isArray(param)) return "";
  return param ?? "";
}

export function stringifyArrayQueryParam(
  param?: LocationQueryValue | LocationQueryValue[],
): string[] {
  if (Array.isArray(param)) return param.filter((p) => p !== null);
  return param ? [param] : [];
}

export function nonEmptyString(value: string): string | undefined {
  return value ? value : undefined;
}

type QueryParam = string | string[] | number | undefined;

export function updateQueryParams(key: string, value: QueryParam) {
  const route = useRoute();
  const currentQuery = route.query;
  const path = route.path;

  const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
  if (isEmpty) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: remove, ...remainingQuery } = currentQuery;
    navigateTo({ path, query: remainingQuery });
    return;
  }
  const query = { ...currentQuery, [key]: value };
  navigateTo({ path, query });
}
