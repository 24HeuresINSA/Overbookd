export type TMapState<T> = Partial<Record<keyof T, (state: T) => T[keyof T]>>;
