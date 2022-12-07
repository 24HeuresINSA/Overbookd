export function isNumber(value: string | null): boolean | string {
  return (
    (value && !isNaN(parseInt(value, 10))) || "La valeur doit être un nombre"
  );
}

export function min(minValue: number) {
  return function (value: string | null) {
    return (
      (value && parseInt(value, 10) >= minValue) ||
      `La valeur doit être au moins de ${minValue}`
    );
  };
}

export function minLength(minLength: number) {
  return function (value: string | null) {
    return (
      (value && value.length >= minLength) ||
      `Taper au moins ${minLength} caracteres`
    );
  };
}

export interface InputRulesData {
  rules: Record<string, (value: string | null) => string | boolean>;
}
