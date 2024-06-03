import { HttpStringified } from "@overbookd/http";
import { IProvidePeriod, Period } from "@overbookd/period";

export function castPeriodsWithDate(
  periods: HttpStringified<IProvidePeriod[]>,
): Period[] {
  return periods.map(castPeriodWithDate);
}

export function castPeriodWithDate(
  period: HttpStringified<IProvidePeriod>,
): Period {
  return Period.init({
    start: new Date(period.start),
    end: new Date(period.end),
  });
}
