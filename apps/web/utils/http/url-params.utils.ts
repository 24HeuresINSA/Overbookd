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

type QueryParam = string | string[] | number | boolean | null | undefined;

export function updateQueryParams(key: string, value: QueryParam) {
  const route = useRoute();
  const currentQuery = route.query;
  const path = route.path;

  const isEmpty = Array.isArray(value) ? value.length === 0 : !value;
  if (isEmpty || value === false) {
    const { [key]: _remove, ...remainingQuery } = currentQuery;
    return navigateTo({ path, query: remainingQuery });
  }
  const query = {
    ...currentQuery,
    [key]: value === true ? null : value,
  };
  return navigateTo({ path, query });
}
