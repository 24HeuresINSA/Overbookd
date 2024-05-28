export const Sort = {
  ASC: 1,
  NONE: 0,
  DESC: -1,
};

export function nextSortDirection(direction: number): number {
  if (direction === Sort.ASC) return Sort.DESC;
  if (direction === Sort.DESC) return Sort.NONE;
  return Sort.ASC;
}
