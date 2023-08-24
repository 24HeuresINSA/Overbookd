import { Field } from "./field";
import { Rule } from "./rule";

export class PasswordField implements Field<string> {
  private readonly minusculePattern = new RegExp("[a-z]");
  private readonly majusculePattern = new RegExp("[A-Z]");
  private readonly numberPattern = new RegExp("[0-9]");
  private readonly specialCharPattern = new RegExp("[!@#$%^&*=+_{}[]()|.]");
  private readonly minPasswordLength = 12;

  private readonly containsMinuscule: Rule<string> = {
    test: (value) => this.minusculePattern.test(value),
    reason: "Il faut au moins une minuscule dans le mot de passe",
  };

  private readonly containsMajuscule: Rule<string> = {
    test: (value) => this.majusculePattern.test(value),
    reason: "Il faut au moins une MAJUSCULE dans le mot de passe",
  };

  private readonly containsNumber: Rule<string> = {
    test: (value) => this.numberPattern.test(value),
    reason: "Il faut au moins un chiffre dans le mot de passe",
  };

  private readonly containsSpecialChar: Rule<string> = {
    test: (value) => this.specialCharPattern.test(value),
    reason:
      "Il faut au moins un caractère spécial (!@#$%^&*=+_{}[]()|.) dans le mot de passe",
  };

  private readonly atLeast8CharactersLong: Rule<string> = {
    test: (value) => value.length >= this.minPasswordLength,
    reason: `Il faut au moins ${this.minPasswordLength} caractères dans le mot de passe`,
  };

  private constructor(private readonly password: string) {}

  static build(password: string): PasswordField {
    return new PasswordField(password);
  }

  get value(): string {
    return this.password;
  }

  private get rules(): Rule<unknown>[] {
    return [
      this.containsMinuscule,
      this.containsMajuscule,
      this.containsNumber,
      this.containsSpecialChar,
      this.atLeast8CharactersLong,
    ];
  }

  get isValid(): boolean {
    return this.rules.every((rule) => rule.test(this.password));
  }

  get reasons(): string[] {
    return this.rules
      .filter((rule) => !rule.test(this.password))
      .map(({ reason }) => reason);
  }
}
