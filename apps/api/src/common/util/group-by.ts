export function groupBy<T, K extends keyof any>(
  arr: T[],
  key: (i: T) => K,
): T[][] {
  const groups = arr.reduce((groups, item) => {
    (groups[key(item)] ||= []).push(item);
    return groups;
  }, {} as Record<K, T[]>);
  return Object.values(groups);
}
