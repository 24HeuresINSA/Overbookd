import type { HttpStringified } from "@overbookd/http";
import { type IProvidePeriod, Period } from "@overbookd/time";

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
