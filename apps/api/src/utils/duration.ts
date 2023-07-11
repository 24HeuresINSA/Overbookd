import { Period } from '@overbookd/period';

export function getPeriodDuration({ start, end }: Period): number {
  return end.getTime() - start.getTime();
}
