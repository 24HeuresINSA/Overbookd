export interface Field<T> {
  value: T;
  isValid: boolean;
  reasons: string[];
}
