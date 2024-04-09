import { Period } from "@overbookd/period";

export class CalculeVolunteerAssignmentDuration {
  static fromPeriods(period: Period[]): number {
    return period.reduce(
      (acc, period) => acc + period.duration.inMilliseconds,
      0,
    );
  }
}
