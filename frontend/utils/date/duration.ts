import { ONE_HOUR_IN_MS, ONE_MINUTE_IN_MS } from "./dateUtils";

export class Duration {
  private constructor(private readonly milliseconds: number) {}

  private get hours(): number {
    return Math.floor(this.milliseconds / ONE_HOUR_IN_MS);
  }

  private get minutes(): number {
    return Math.floor((this.milliseconds % ONE_HOUR_IN_MS) / ONE_MINUTE_IN_MS);
  }

  static fromMilliseconds(milliseconds: number): Duration {
    return new Duration(milliseconds);
  }

  toString(): string {
    const formattedHours = this.hours.toString();
    const formattedMinutes = this.minutes.toString().padStart(2, "0");
    return `${formattedHours}h${formattedMinutes}`;
  }
}
