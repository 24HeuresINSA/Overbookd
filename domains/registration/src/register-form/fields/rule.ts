export interface Rule<T> {
  test(value: T): boolean;
  reason: string;
}
