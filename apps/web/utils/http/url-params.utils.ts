import type { LocationQuery, LocationQueryValue } from "vue-router";
import type { Ref } from "vue";

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

export function useRouteQueryFilters<T extends object>(
  parse: (query: LocationQuery) => T,
): Ref<T> {
  const route = useRoute();
  const filters = ref({}) as Ref<T>;
  const updateFilters = () => {
    filters.value = parse(route.query);
  };
  onMounted(updateFilters);
  watch(() => route.query, updateFilters);
  return filters;
}
