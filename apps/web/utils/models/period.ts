import { IProvidePeriod } from '@overbookd/period';
import { HttpStringified } from '../types/http';

export interface PeriodWithId extends IProvidePeriod {
  id: number;
}

export function castPeriods(
  periods: HttpStringified<IProvidePeriod[]>
): IProvidePeriod[] {
  return periods.map(castPeriod);
}

export function castPeriod(
  period: HttpStringified<IProvidePeriod>
): IProvidePeriod {
  return {
    start: new Date(period.start),
    end: new Date(period.end),
  };
}

export function getPeriodDuration({ start, end }: IProvidePeriod): number {
  return end.getTime() - start.getTime();
}
