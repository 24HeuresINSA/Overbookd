import { Field } from "./field.js";
import { findNumbers } from "awesome-phonenumber";

export class MobilePhoneField implements Field<string> {
  private constructor(private readonly mobilePhone: string) {}

  get value(): string {
    return this.mobilePhone;
  }

  get isValid(): boolean {
    const found = findNumbers(this.mobilePhone, { defaultRegionCode: "FR" });
    return (
      (found.length === 1 &&
        found.at(0)?.text === this.mobilePhone &&
        found.at(0)?.phoneNumber.typeIsMobile) ||
      false
    );
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Numéro de téléphone mobile non valable"];
  }

  static build(mobilePhone: string): MobilePhoneField {
    return new MobilePhoneField(mobilePhone);
  }
}
