import { SHIFT_HOURS_UTC } from "@overbookd/volunteer-availability";

export const SHIFT_HOURS = {
  DAY: SHIFT_HOURS_UTC.DAY + 2,
  NIGHT: SHIFT_HOURS_UTC.NIGHT + 2,
  PARTY: SHIFT_HOURS_UTC.PARTY + 2,
};

export function isPartyShift(hour: number): boolean {
  return hour >= SHIFT_HOURS.PARTY || hour < SHIFT_HOURS.NIGHT;
}
