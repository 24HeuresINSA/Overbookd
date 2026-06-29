import type { ConfigurationKey } from "./keys";

export type Configuration<
  T extends object | string | number | boolean =
    | object
    | string
    | number
    | boolean,
> = {
  key: ConfigurationKey;
  value: T;
};
