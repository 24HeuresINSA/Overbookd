import { IProvidePeriod } from '@overbookd/period';

export function getPeriodDuration({ start, end }: IProvidePeriod): number {
  return end.getTime() - start.getTime();
}
