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

export function moveAtFirstIndex<T = any>(list: T[], index: number): T[] {
  const item = list.at(index);
  if (!item) return list;
  return [item, ...list.slice(0, index), ...list.slice(index + 1)];
}
