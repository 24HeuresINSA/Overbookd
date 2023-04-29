import { HttpStringified } from "../types/http";

export interface Period {
  start: Date;
  end: Date;
}

export interface PeriodWithId extends Period {
  id: number;
}

export function castPeriods(periods: HttpStringified<Period[]>): Period[] {
  return periods.map(castPeriod);
}

export function castPeriod(period: HttpStringified<Period>): Period {
  return {
    ...period,
    start: new Date(period.start),
    end: new Date(period.end),
  };
}
