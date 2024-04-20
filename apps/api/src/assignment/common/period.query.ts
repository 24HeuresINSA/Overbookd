import { IProvidePeriod } from "@overbookd/period";

export const SELECT_PERIOD = { start: true, end: true };

export function includePeriodCondition(period: IProvidePeriod) {
  return {
    start: { lte: period.end },
    end: { gte: period.start },
  };
}
