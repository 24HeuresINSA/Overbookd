import { isMobilePhoneNumberValid } from "../../phone-number/phone-number.js";
import { Field } from "./field.js";

export class MobilePhoneField implements Field<string> {
  private constructor(private readonly mobilePhone: string) {}

  get value(): string {
    return this.mobilePhone;
  }

  get isValid(): boolean {
    return isMobilePhoneNumberValid(this.mobilePhone);
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Numéro de téléphone mobile non valable"];
  }

  static build(mobilePhone: string): MobilePhoneField {
    return new MobilePhoneField(mobilePhone);
  }
}
