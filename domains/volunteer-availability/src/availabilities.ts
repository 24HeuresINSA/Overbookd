import { Period, OverDate } from "@overbookd/time";
import { AvailabilityDate } from "./date.js";
import { AVAILABILITY_ERROR_MESSAGES } from "./volunteer-availability.error.js";

const MINIMIM_PERIOD_DURATION_HOURS = 2;

export type AvailabilityErrorMessage = { message: string; period: Period };

type InitAvailabilities = {
  selected?: Period[];
  recorded?: Period[];
};

export class Availabilities {
  private constructor(
    readonly recorded: Period[],
    readonly selected: Period[],
  ) {}

  static init(state?: InitAvailabilities): Availabilities {
    const selected = state?.selected ?? [];
    const recorded = state?.recorded ?? [];
    return new Availabilities(recorded, selected);
  }

  select(date: OverDate): Availabilities {
    const period = AvailabilityDate.fromOverDate(date).period;
    const isAlreadyRecorded = this.recorded.some((availability) =>
      availability.includes(period),
    );
    if (isAlreadyRecorded) return this;

    const periods = [...this.selected, period];
    return new Availabilities(this.recorded, Period.mergeContiguous(periods));
  }

  unselect(date: OverDate): Availabilities {
    const period = AvailabilityDate.fromOverDate(date).period;
    const periods = this.selected.reduce(
      (availabilities: Period[], availability) => {
        const isPeriodIncluded = period.isOverlapping(availability);
        if (!isPeriodIncluded) return [...availabilities, availability];

        const remainingPeriods = availability.substract(period);
        return [...availabilities, ...remainingPeriods];
      },
      [],
    );
    return new Availabilities(this.recorded, periods);
  }

  get list(): Period[] {
    const periods = [...this.recorded, ...this.selected];
    return Period.sort(Period.mergeContiguous(periods));
  }

  get errors(): AvailabilityErrorMessage[] {
    return this.list.reduce(
      (errors: AvailabilityErrorMessage[], availability) => {
        if (availability.duration.inHours >= MINIMIM_PERIOD_DURATION_HOURS)
          return errors;

        const error = {
          period: availability,
          message: AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION,
        };
        return [...errors, error];
      },
      [],
    );
  }
}
