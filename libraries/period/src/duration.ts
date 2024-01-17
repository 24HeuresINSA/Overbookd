import {
  ONE_HOUR_IN_MS,
  ONE_MINUTE_IN_MS,
  ONE_SECOND_IN_MS,
} from "./duration.constant";

export class Duration {
  private constructor(private readonly milliseconds: number) {}

  static ms(milliseconds: number): Duration {
    return new Duration(milliseconds);
  }

  static hours(hours: number): Duration {
    return new Duration(hours * ONE_HOUR_IN_MS);
  }

  get inSeconds(): number {
    return Math.ceil(this.milliseconds / ONE_SECOND_IN_MS);
  }

  get inMinutes(): number {
    return Math.ceil(this.milliseconds / ONE_MINUTE_IN_MS);
  }

  get inHours(): number {
    return Math.ceil(this.milliseconds / ONE_HOUR_IN_MS);
  }

  isDividedBy(divider: Duration): boolean {
    return this.milliseconds % divider.milliseconds === 0;
  }
}
