import { Field } from "./field";

export class LastnameField implements Field<string> {
  private constructor(private readonly lastname: string) { }

  get value(): string {
    return this.lastname;
  }

  get isValid(): boolean {
    return this.lastname.length > 0;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Il faut renseigner un nom"];
  }

  static build(lastname: string): LastnameField {
    return new LastnameField(lastname);
  }
}
