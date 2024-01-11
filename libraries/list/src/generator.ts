export function* numberGenerator(
  start: number,
  excludes: number[] = [],
): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    if (excludes.includes(i)) continue;
    yield i;
  }
}
