import { Field } from "./field";

export class MobilePhoneField implements Field<string> {
  private readonly mobilePhoneNumberPattern = new RegExp("0[6-7]{1}[0-9]{8}$");

  private constructor(private readonly mobilePhone: string) {}

  get value(): string {
    return this.mobilePhone;
  }

  get isValid(): boolean {
    return this.mobilePhoneNumberPattern.test(this.mobilePhone);
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Numéro de téléphone mobile non valable"];
  }

  static build(mobilePhone: string): MobilePhoneField {
    return new MobilePhoneField(mobilePhone);
  }
}
