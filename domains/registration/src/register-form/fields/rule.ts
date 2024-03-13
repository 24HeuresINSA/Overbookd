export type Rule<T> = {
  test(value: T): boolean;
  reason: string;
};
