import { IProvidePeriod } from "@overbookd/period";

export const SELECT_PERIOD = { start: true, end: true };

export function overlapPeriodCondition(period: IProvidePeriod) {
  return {
    start: { lte: period.end },
    end: { gte: period.start },
  };
}

export function includePeriodCondition(period: IProvidePeriod) {
  return {
    start: { lte: period.start },
    end: { gte: period.end },
  };
}
