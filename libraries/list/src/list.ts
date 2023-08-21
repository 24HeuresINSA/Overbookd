export function updateItemToList<T>(
  list: T[],
  index: number,
  newValue: T,
): T[] {
  if (index < 0) return updateItemToList(list, list.length + index, newValue);
  return [...list.slice(0, index), newValue, ...list.slice(index + 1)];
}

export function removeItemAtIndex<T>(list: T[], index: number): T[] {
  if (index < 0) return removeItemAtIndex(list, list.length + index);
  return [...list.slice(0, index), ...list.slice(index + 1)];
}

export function moveAtFirstIndex<T>(list: T[], index: number): T[] {
  const item = list.at(index);
  if (!item) return list;
  return [item, ...list.slice(0, index), ...list.slice(index + 1)];
}
