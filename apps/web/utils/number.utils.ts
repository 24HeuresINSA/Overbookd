export function isOdd(n: number): boolean {
  return n % 2 === 1;
}

function boundValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentBetween(
  value: number,
  min: number,
  max: number,
): number {
  const bounded = boundValue(value, min, max);
  return ((bounded - min) / (max - min)) * 100;
}
