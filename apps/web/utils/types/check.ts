export function isNumber(value?: number | null): value is number {
  return value !== null && value !== undefined;
}

export function isString(value?: string | null): value is string {
  return value !== null && value !== undefined;
}
