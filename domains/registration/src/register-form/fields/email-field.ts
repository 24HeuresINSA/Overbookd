import { Field } from "./field";
import { Rule } from "./rule";

export class EmailField implements Field<string> {
  private readonly emailPattern = new RegExp(
    "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$",
  );
  private readonly insaEmailPattern = new RegExp("^((?!insa-lyon.fr).)*$");

  private readonly validEmail: Rule<string> = {
    test: (value) => this.emailPattern.test(value),
    reason: "Adresse mail non valable",
  };

  private readonly nonInsaEmail: Rule<string> = {
    test: (value) => this.insaEmailPattern.test(value),
    reason: "Pas d'adresse insa 🙏",
  };

  private constructor(private readonly email: string) {}

  static build(email: string): EmailField {
    return new EmailField(email);
  }

  get value(): string {
    return this.email;
  }

  private get rules(): Rule<unknown>[] {
    return [this.validEmail, this.nonInsaEmail];
  }

  get isValid(): boolean {
    return this.rules.every((rule) => rule.test(this.email));
  }

  get reasons(): string[] {
    return this.rules
      .filter((rule) => !rule.test(this.email))
      .map(({ reason }) => reason);
  }
}
