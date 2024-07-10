import type { LocationQueryValue } from "vue-router";

export function stringifyQueryParam(
  param?: LocationQueryValue | LocationQueryValue[],
): string {
  if (Array.isArray(param)) return "";
  return param ?? "";
}

export function nonEmptyString(value: string): string | undefined {
  return value ? value : undefined;
}

export function updateQueryParams(key: string, value?: string | number) {
  const route = useRoute();
  const router = useRouter();

  const currentQuery = route.query;
  const path = route.path;
  if (!value) {
    const { [key]: remove, ...remainingQuery } = currentQuery;
    router.push({ path, query: remainingQuery });
    return;
  }
  const query = { ...currentQuery, [key]: value };
  router.push({ path, query });
}
