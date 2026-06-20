import { Field } from "./field.js";

export class FirstNameField implements Field<string> {
  private constructor(private readonly firstName: string) {}

  get value(): string {
    return this.firstName;
  }

  get isValid(): boolean {
    return this.firstName.length > 0;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Il faut renseigner un prenom"];
  }

  static build(firstName: string): FirstNameField {
    return new FirstNameField(firstName);
  }
}
