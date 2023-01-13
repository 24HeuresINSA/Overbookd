export function updateItemToList<T>(
  list: T[],
  index: number,
  newValue: T
): T[] {
  return [...list.slice(0, index), newValue, ...list.slice(index + 1)];
}

export function removeItemAtIndex<T = any>(list: T[], index: number): T[] {
  return [...list.slice(0, index), ...list.slice(index + 1)];
}
