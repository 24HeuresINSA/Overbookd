import { HttpStringified } from "../types/http";

export interface Period {
  start: Date;
  end: Date;
}

export function castPeriods(periods: HttpStringified<Period[]>): Period[] {
  return periods.map(castPeriod);
}

function castPeriod(period: HttpStringified<Period>): Period {
  return {
    start: new Date(period.start),
    end: new Date(period.end),
  };
}
