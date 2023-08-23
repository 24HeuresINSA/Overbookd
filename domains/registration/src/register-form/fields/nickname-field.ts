import { Field } from "./field";

export class NicknameField implements Field<string | undefined> {
  private constructor(private readonly nickname?: string) { }

  get value(): string | undefined {
    return this.nickname;
  }

  get isValid(): boolean {
    return this.nickname === undefined ? true : this.nickname.length > 0;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Il faut renseigner un surnom"];
  }

  static build(nickname?: string): NicknameField {
    return new NicknameField(nickname);
  }
}
