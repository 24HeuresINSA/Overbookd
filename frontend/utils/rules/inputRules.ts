export function isNumber(value: string | null): boolean | string {
  return (
    (value != undefined && !isNaN(parseInt(value, 10))) ||
    "La valeur doit être un nombre"
  );
}

export function min(minValue: number) {
  return function (value: string | null) {
    return (
      (value != undefined && parseInt(value, 10) >= minValue) ||
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

export function minDate(minDate: Date) {
  return function (value: string | null) {
    return (
      (value && new Date(value).getTime() >= minDate.getTime()) ||
      "Vous n'êtes pas si vieux !"
    );
  };
}

export function maxDate(maxDate: Date = new Date()) {
  return function (value: string | null) {
    return (
      (value && new Date(value).getTime() < maxDate.getTime()) ||
      "Tu n'es pas si jeune !"
    );
  };
}

const emailPattern = new RegExp(
  "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$"
);

export function isEmail(value: string | null) {
  return (value && emailPattern.test(value)) || "Adresse mail non valable";
}

const insaEmailPattern = new RegExp(`^.+@(?!insa-lyon.fr).*`);

export function isInsaEmail(value: string | null) {
  return (value && insaEmailPattern.test(value)) || "Pas d'adresse insa 🙏";
}

const mobilePhoneNumberPattern = new RegExp(`0[6-7]{1}[0-9]{8}$`);

export function isMobilePhoneNumber(value: string | null) {
  return (
    (value && mobilePhoneNumberPattern.test(value)) ||
    "Numéro de téléphone non valable"
  );
}

const passwordPattern = new RegExp(
  `^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$`
);

export function password(value: string | null) {
  return (
    (value && passwordPattern.test(value)) ||
    "Au moins une MAJUSCULE, minuscule, un chiffre et 8 caractères"
  );
}

export function isSame(matching: string | null) {
  return (value: string | null) => {
    return value === matching || "La valeur ne correspond pas";
  };
}

export function required(value: any) {
  return Boolean(value) || "Ce champ est requis";
}

export function maxCharacters(maxCharacters: number) {
  return function (value: string | null) {
    return (
      (value && value.length <= maxCharacters) ||
      `${maxCharacters} caractères maximum`
    );
  };
}

export interface InputRulesData {
  rules: Record<string, (value: string | null) => string | boolean>;
}
