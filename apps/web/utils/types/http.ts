export type HttpStringified<T extends object> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends undefined | Date
    ? undefined | string
    : T[K] extends object
    ? HttpStringified<T[K]>
    : T[K] extends undefined | object
    ? undefined | HttpStringified<Required<T[K]>>
    : T[K];
};
