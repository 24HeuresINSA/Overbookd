import { findNumbers } from "awesome-phonenumber";

export function isMobilePhoneNumberValid(phoneNumber: string): boolean {
  const found = findNumbers(phoneNumber, { defaultRegionCode: "FR" });
  return (
    (found.length === 1 &&
      found.at(0)?.text === phoneNumber &&
      found.at(0)?.phoneNumber.typeIsMobile) ||
    false
  );
}

export function isPhoneNumberValid(phoneNumber: string): boolean {
  const found = findNumbers(phoneNumber, { defaultRegionCode: "FR" });
  return (found.length === 1 && found.at(0)?.text === phoneNumber) || false;
}
