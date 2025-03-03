import { IProvidePeriod } from "@overbookd/time";

export const SELECT_PERIOD = { start: true, end: true };

export const SELECT_PERIOD_WITH_ID = { id: true, ...SELECT_PERIOD };

export const ORDER_BY_PERIOD = [
  { start: "asc" } as const,
  { end: "asc" } as const,
];

export function overlapPeriodCondition(period: IProvidePeriod) {
  return {
    start: { lt: period.end },
    end: { gt: period.start },
  };
}

export function includePeriodCondition(period: IProvidePeriod) {
  return {
    start: { lte: period.start },
    end: { gte: period.end },
  };
}
