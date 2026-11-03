function normalizeIndex(length: number, index: number): number {
  return index < 0 ? length + index : index;
}

export function updateItemToList<T>(
  list: T[] | readonly T[],
  index: number,
  newValue: T,
): T[] {
  const normalizedIndex = normalizeIndex(list.length, index);
  if (normalizedIndex < 0) return [...list];
  return [
    ...list.slice(0, normalizedIndex),
    newValue,
    ...list.slice(normalizedIndex + 1),
  ];
}

export function removeItemAtIndex<T>(list: T[], index: number): T[] {
  const normalizedIndex = normalizeIndex(list.length, index);
  if (normalizedIndex < 0) return [...list];
  return [
    ...list.slice(0, normalizedIndex),
    ...list.slice(normalizedIndex + 1),
  ];
}

export function moveAtFirstIndex<T>(list: T[], index: number): T[] {
  const normalizedIndex = normalizeIndex(list.length, index);
  if (normalizedIndex < 0 || normalizedIndex >= list.length) return [...list];

  const [item] = list.slice(normalizedIndex, normalizedIndex + 1);
  return [
    item,
    ...list.slice(0, normalizedIndex),
    ...list.slice(normalizedIndex + 1),
  ];
}

export type WithAtLeastOneItem<T> = [T, ...T[]];

export type Item<T extends Array<unknown>> = T[number];

export function hasAtLeastOneItem<T>(list: T[]): list is WithAtLeastOneItem<T> {
  return list.length > 0;
}

export function isEmpty<T>(list: T[]): list is [] {
  return list.length === 0;
}

export const MISSING_ITEM_INDEX = -1;
