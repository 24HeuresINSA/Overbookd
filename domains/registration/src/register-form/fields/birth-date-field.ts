import { Field } from "./field.js";
import { Rule } from "./rule.js";

export class BirthDateField implements Field<Date> {
  private readonly minimumBirthDate = new Date("1950-01-01");

  private readonly notBefore1950: Rule<Date> = {
    test: (value) => value.getTime() > this.minimumBirthDate.getTime(),
    reason: "Tu n'es pas si vieux !",
  };

  private readonly notInFuture: Rule<Date> = {
    test: (value) => value.getTime() < Date.now(),
    reason: "Tu ne peux pas naître dans le futur 🕵️‍♂️",
  };

  private constructor(private readonly birthDate: Date) {}

  static build(birthDate: Date): BirthDateField {
    return new BirthDateField(birthDate);
  }

  get value(): Date {
    return this.birthDate;
  }

  private get rules(): Rule<unknown>[] {
    return [this.notBefore1950, this.notInFuture];
  }

  get isValid(): boolean {
    return this.rules.every((rule) => rule.test(this.birthDate));
  }

  get reasons(): string[] {
    return this.rules
      .filter((rule) => !rule.test(this.birthDate))
      .map(({ reason }) => reason);
  }
}
