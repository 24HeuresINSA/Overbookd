import { type ParsedPhoneNumber, parsePhoneNumber } from "awesome-phonenumber";

const FRENCH_REGION_CODE = "FR";

function parseNumber(phoneNumber: string): ParsedPhoneNumber {
  return parsePhoneNumber(phoneNumber, { regionCode: FRENCH_REGION_CODE });
}

function isFrenchNumber(parsedNumber: ParsedPhoneNumber): boolean {
  return parsedNumber.regionCode === FRENCH_REGION_CODE;
}

function buildWhatsAppLink(phoneNumber: string): string {
  return `https://wa.me/${phoneNumber}`;
}

export function isMobilePhoneNumberValid(phoneNumber: string): boolean {
  const parsedNumber = parseNumber(phoneNumber);
  return parsedNumber.valid && parsedNumber.typeIsMobile;
}

export function isPhoneNumberValid(phoneNumber: string): boolean {
  const parsedNumber = parseNumber(phoneNumber);
  return parsedNumber.valid;
}

export function formatPhoneNumber(phoneNumber: string): string {
  const parsedNumber = parseNumber(phoneNumber);
  if (!parsedNumber.valid) return phoneNumber;
  return isFrenchNumber(parsedNumber)
    ? parsedNumber.number.national
    : parsedNumber.number.international;
}

export function formatPhoneLink(phoneNumber: string): string {
  const parsedNumber = parseNumber(phoneNumber);
  if (!parsedNumber.valid) return `tel:${phoneNumber}`;
  return isFrenchNumber(parsedNumber)
    ? parsedNumber.number.rfc3966
    : buildWhatsAppLink(parsedNumber.number.e164);
}

export function formatEmailLink(email: string): string {
  return `mailto:${email}`;
}
