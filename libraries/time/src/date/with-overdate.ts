import { OverDate } from "./date";

export type WithOverDate<T extends object> = {
  [K in keyof T]: T[K] extends Date
    ? OverDate
    : T[K] extends undefined | Date
      ? undefined | OverDate
      : T[K] extends object
        ? WithOverDate<T[K]>
        : T[K] extends undefined | object
          ? undefined | WithOverDate<Required<T[K]>>
          : T[K];
};
