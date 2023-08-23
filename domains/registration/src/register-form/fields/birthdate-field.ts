import { Field } from "./field";
import { Rule } from "./rule";

export class BirthdateField implements Field<Date> {
  private readonly minimumBirthdate = new Date("1950-01-01");

  private readonly notBefore1950: Rule<Date> = {
    test: (value) => value.getTime() > this.minimumBirthdate.getTime(),
    reason: "Vous n'êtes pas si vieux !",
  };

  private readonly notInFuture: Rule<Date> = {
    test: (value) => value.getTime() < Date.now(),
    reason: "Tu ne peux pas naitre dans le futur 🕵️‍♂️",
  };

  private constructor(private readonly birthdate: Date) { }

  static build(birthdate: Date): BirthdateField {
    return new BirthdateField(birthdate);
  }

  get value(): Date {
    return this.birthdate;
  }

  private get rules(): Rule<unknown>[] {
    return [this.notBefore1950, this.notInFuture];
  }

  get isValid(): boolean {
    return this.rules.every((rule) => rule.test(this.birthdate));
  }

  get reasons(): string[] {
    return this.rules
      .filter((rule) => !rule.test(this.birthdate))
      .map(({ reason }) => reason);
  }
}
