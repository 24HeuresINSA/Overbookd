export function isNumber(value: string | null): boolean | string {
  const message = "La valeur doit être un nombre";
  return (value != undefined && !isNaN(parseInt(value, 10))) || message;
}

export function min(minValue: number) {
  const message = `La valeur doit être au moins de ${minValue}`;
  return function (value: string | null) {
    return (value != undefined && parseFloat(value) >= minValue) || message;
  };
}

export function minLength(minLength: number) {
  return function (value: string | null) {
    const message = `Taper au moins ${minLength} caracteres`;
    return (value && value.length >= minLength) || message;
  };
}

export function maxLength(maxLength: number) {
  return function (value: unknown[] | null) {
    const message = `Pas plus de ${maxLength}`;
    return (value && value.length <= maxLength) || message;
  };
}

export function minDate(minDate: Date) {
  return function (value: string | null) {
    const message = "Vous n'êtes pas si vieux !";
    return (value && new Date(value).getTime() >= minDate.getTime()) || message;
  };
}

export function maxDate(maxDate: Date = new Date()) {
  return function (value: string | null) {
    const message = "Tu n'es pas si jeune !";
    return (value && new Date(value).getTime() < maxDate.getTime()) || message;
  };
}

const emailPattern = new RegExp(
  "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$",
);

export function isEmail(value: string | null) {
  return (value && emailPattern.test(value)) || "Adresse mail non valable";
}

const insaEmailPattern = new RegExp("^.+@(?!insa-lyon.fr).*");

export function isInsaEmail(value: string | null) {
  return (value && insaEmailPattern.test(value)) || "Pas d'adresse insa 🙏";
}

const mobilePhoneNumberPattern = new RegExp("0[6-7]{1}[0-9]{8}$");

export function isMobilePhoneNumber(value: string | null) {
  const message = "Numéro de téléphone non valable";
  return (value && mobilePhoneNumberPattern.test(value)) || message;
}

const passwordPattern = new RegExp(
  "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*=+_{}[]()|.]).{12,}$",
);

export function password(value: string | null) {
  const message =
    "Au moins une MAJUSCULE, minuscule, un chiffre, un caractère spécial et 12 caractères";
  return (value && passwordPattern.test(value)) || message;
}

export function isSame(matching: string | null) {
  return (value: string | null) => {
    return value === matching || "La valeur ne correspond pas";
  };
}

export function required(value: unknown) {
  return Boolean(value) || "Ce champ est requis";
}

export function isImage(value?: File | null): string | boolean {
  const message = "Une photo vide n'est pas une photo";
  return !!value || message;
}

export function isImageSizeWithinLimit(value?: File | null): string | boolean {
  const MAX_SIZE = 1024 * 1024 * 2;
  const message = "Moins de 2 Mo s'il vous plaît 🙏";
  return (value?.size ?? 0) < MAX_SIZE || message;
}

export function isSupportedImageFile(value?: File | null): string | boolean {
  const extensions = ["image/png", "image/jpeg", "image/gif"];
  const message = "Seulement des images (png, jpeg ou gif)";
  const isSupportedFile = !!value && extensions.includes(value.type);
  return isSupportedFile || message;
}

export function imageRules(value?: File | null): string | boolean {
  return [
    isImage,
    isImageSizeWithinLimit,
    isSupportedImageFile,
  ].every((rule) => rule(value) === true);
}


export interface InputRulesData {
  rules: Record<string, (value: string | null) => string | boolean>;
  fileRules?: Record<string, (value?: File | null) => string | boolean>;
}

export interface InputRulesDataWithImage {
  rules: Record<string, (value: string | null) => string | boolean>;
  fileRules: Record<string, (value?: File | null) => string | boolean>;
}
