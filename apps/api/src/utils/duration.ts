import { Period } from 'src/volunteer-availability/domain/period.model';

export function getPeriodDuration({ start, end }: Period): number {
  return end.getTime() - start.getTime();
}
