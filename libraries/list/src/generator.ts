export function* numberGenerator(start: number): Generator<number> {
  for (let i = start; i < 1_000_000; i++) {
    yield i;
  }
}
