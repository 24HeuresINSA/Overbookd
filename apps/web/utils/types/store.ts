export type TMapState<T> = Partial<{
  [key in keyof T]: (state: T) => T[key];
}>;
