import { Field } from "./field";

export class CommentField implements Field<string | undefined> {
  private constructor(private readonly comment?: string) {}

  get value(): string | undefined {
    return this.comment;
  }

  get isValid(): boolean {
    return this.comment === undefined ? true : this.comment.length > 0;
  }

  get reasons(): string[] {
    return this.isValid ? [] : ["Il faut préciser ton commentaire"];
  }

  static build(comment?: string): CommentField {
    return new CommentField(comment);
  }
}
