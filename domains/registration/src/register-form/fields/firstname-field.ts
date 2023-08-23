import { Field } from "./field";

export class FirstnameField implements Field<string> {
  private constructor(private readonly firstname: string) { }

  get value(): string {
    return this.firstname;
  }

  get isValid(): boolean {
    return this.firstname.length > 0;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Il faut renseigner un prenom"];
  }

  static build(firstname: string): FirstnameField {
    return new FirstnameField(firstname);
  }
}
