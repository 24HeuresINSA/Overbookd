import { AccountStatus, accountStatuses } from "../fulfilled-registration.js";
import { Field } from "./field.js";
import { Rule } from "./rule.js";

// eslint-disable-next-line no-useless-escape
export const SPECIAL_CHARS_REGEX_PATTERN = "[!@#$%^&*+=_.,;:?{}()\/\|\\\-]";

export class PasswordField implements Field<string | undefined> {
  private readonly minusculePattern = new RegExp("[a-z]");
  private readonly majusculePattern = new RegExp("[A-Z]");
  private readonly numberPattern = new RegExp("[0-9]");
  private readonly specialCharPattern = new RegExp(SPECIAL_CHARS_REGEX_PATTERN);
  private readonly minPasswordLength = 12;

  private readonly containsMinuscule: Rule<string> = {
    test: (value) => this.minusculePattern.test(value),
    reason: "Il faut au moins une minuscule dans le mot de passe.",
  };

  private readonly containsMajuscule: Rule<string> = {
    test: (value) => this.majusculePattern.test(value),
    reason: "Il faut au moins une MAJUSCULE dans le mot de passe.",
  };

  private readonly containsNumber: Rule<string> = {
    test: (value) => this.numberPattern.test(value),
    reason: "Il faut au moins un chiffre dans le mot de passe.",
  };

  private readonly containsSpecialChar: Rule<string> = {
    test: (value) => this.specialCharPattern.test(value),
    reason:
      "Il faut au moins un caractère spécial (!@#$%^&*=+_{}[]()|.) dans le mot de passe.",
  };

  private readonly atLeast8CharactersLong: Rule<string> = {
    test: (value) => value.length >= this.minPasswordLength,
    reason: `Il faut au moins ${this.minPasswordLength} caractères dans le mot de passe.`,
  };

  private constructor(
    private readonly password: string | undefined,
    private readonly accountStatus: AccountStatus,
  ) {}

  static build(
    password: string | undefined,
    accountStatus: AccountStatus,
  ): PasswordField {
    return new PasswordField(password, accountStatus);
  }

  get value(): string | undefined {
    return this.accountStatus === accountStatuses.NEW
      ? this.password
      : undefined;
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
    if (this.accountStatus === accountStatuses.EXISTING) return true;
    return this.rules.every((rule) => rule.test(this.password));
  }

  get reasons(): string[] {
    if (this.accountStatus === accountStatuses.EXISTING) return [];
    return this.rules
      .filter((rule) => !rule.test(this.password ?? ""))
      .map(({ reason }) => reason);
  }
}
