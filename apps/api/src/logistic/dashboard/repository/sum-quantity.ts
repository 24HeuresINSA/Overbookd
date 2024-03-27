export function sumQuantity(list: { quantity: number }[]): number {
  return list.reduce((count, { quantity }) => count + quantity, 0);
}
