import { Field } from "./field.js";

export class LastNameField implements Field<string> {
  private constructor(private readonly lastName: string) {}

  get value(): string {
    return this.lastName;
  }

  get isValid(): boolean {
    return this.lastName.length > 0;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Il faut renseigner un nom"];
  }

  static build(lastName: string): LastNameField {
    return new LastNameField(lastName);
  }
}
