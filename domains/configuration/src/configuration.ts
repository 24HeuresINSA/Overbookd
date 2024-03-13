export type Configuration<
  T extends object | string | number | boolean =
    | object
    | string
    | number
    | boolean,
> = {
  key: string;
  value: T;
};
