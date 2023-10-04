export type Event<T extends string, U extends object> = {
  type: T;
  data: U;
};
