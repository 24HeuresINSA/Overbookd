export function sumQuantities(list: { quantity: number }[]): number {
  return list.reduce((sum, { quantity }) => sum + quantity, 0);
}
