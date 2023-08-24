import { Field } from "./field";
import { Rule } from "./rule";

export class MobilePhoneField implements Field<string> {
  private readonly mobilePhoneNumberPattern = new RegExp(
    "^(0|[+]([1-9])([0-9])?([0-9])?)[6-7]{1}[0-9]{8}$",
  );
  private readonly internationalFormatPattern = new RegExp(
    "^[+][1-9][0-9]?[0-9]?",
  );

  private readonly validMobilePhone: Rule<string> = {
    test: (value) => this.mobilePhoneNumberPattern.test(value),
    reason: "Numéro de téléphone mobile non valable",
  };

  private readonly nonInternationalFormat: Rule<string> = {
    test: (value) => !this.internationalFormatPattern.test(value),
    reason: "Nous ne supportons pas les numéros au format international",
  };

  private constructor(private readonly mobilePhone: string) {}

  get value(): string {
    return this.mobilePhone;
  }

  private get rules(): Rule<unknown>[] {
    return [this.validMobilePhone, this.nonInternationalFormat];
  }

  get isValid(): boolean {
    return this.rules.every((rule) => rule.test(this.mobilePhone));
  }

  get reasons(): string[] {
    return this.rules
      .filter((rule) => !rule.test(this.mobilePhone))
      .map(({ reason }) => reason);
  }

  static build(mobilePhone: string): MobilePhoneField {
    return new MobilePhoneField(mobilePhone);
  }
}
