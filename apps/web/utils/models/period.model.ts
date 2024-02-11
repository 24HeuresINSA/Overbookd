import { IProvidePeriod, Period } from "@overbookd/period";
import { HttpStringified } from "@overbookd/http";

export interface PeriodWithId extends IProvidePeriod {
  id: number;
}

export function castPeriods(
  periods: HttpStringified<IProvidePeriod[]>,
): Period[] {
  return periods.map(castPeriod);
}

export function castPeriod(period: HttpStringified<IProvidePeriod>): Period {
  return Period.init({
    start: new Date(period.start),
    end: new Date(period.end),
  });
}

export function getPeriodDuration({ start, end }: IProvidePeriod): number {
  return end.getTime() - start.getTime();
}
