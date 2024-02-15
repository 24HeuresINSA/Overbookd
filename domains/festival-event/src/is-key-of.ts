export function isKeyOf<T extends object>(
  object: T,
  key: string | number | symbol
): key is keyof T {
  return Object.keys(object).includes(key.toString());
}
