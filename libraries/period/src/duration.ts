import { ONE_SECOND_IN_MS } from "./duration.constant";

export class Duration {
  constructor(private readonly milliseconds: number) {}

  static ms(milliseconds: number): Duration {
    return new Duration(milliseconds);
  }

  get inSeconds(): number {
    return Math.ceil(this.milliseconds / ONE_SECOND_IN_MS);
  }
}
