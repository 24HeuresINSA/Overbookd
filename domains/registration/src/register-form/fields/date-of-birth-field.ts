import { Field } from "./field.js";
import { Rule } from "./rule.js";

export class DateOfBirthField implements Field<Date> {
  private readonly minimumDateOfBirth = new Date("1950-01-01");

  private readonly notBefore1950: Rule<Date> = {
    test: (value) => value.getTime() > this.minimumDateOfBirth.getTime(),
    reason: "Tu n'es pas si vieux !",
  };

  private readonly notInFuture: Rule<Date> = {
    test: (value) => value.getTime() < Date.now(),
    reason: "Tu ne peux pas naître dans le futur 🕵️‍♂️",
  };

  private constructor(private readonly dateOfBirth: Date) {}

  static build(dateOfBirth: Date): DateOfBirthField {
    return new DateOfBirthField(dateOfBirth);
  }

  get value(): Date {
    return this.dateOfBirth;
  }

  private get rules(): Rule<unknown>[] {
    return [this.notBefore1950, this.notInFuture];
  }

  get isValid(): boolean {
    return this.rules.every((rule) => rule.test(this.dateOfBirth));
  }

  get reasons(): string[] {
    return this.rules
      .filter((rule) => !rule.test(this.dateOfBirth))
      .map(({ reason }) => reason);
  }
}
