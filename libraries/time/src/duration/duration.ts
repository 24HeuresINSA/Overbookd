import {
  ONE_HOUR_IN_MS,
  ONE_MINUTE_IN_MS,
  ONE_SECOND_IN_MS,
} from "./duration.constant.js";

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

  get inMilliseconds(): number {
    return this.milliseconds;
  }

  canBeDividedBy(divider: Duration): boolean {
    return this.milliseconds % divider.milliseconds === 0;
  }

  toString(): string {
    const hours = Math.floor(this.milliseconds / ONE_HOUR_IN_MS);
    const minutes = Math.floor(
      (this.milliseconds % ONE_HOUR_IN_MS) / ONE_MINUTE_IN_MS,
    );
    const formattedHours = hours.toString();
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}h${formattedMinutes}`;
  }
}
